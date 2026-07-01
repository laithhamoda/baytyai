'use server';

import { z } from 'zod';

import { ok, err } from '@/lib/actions/types';
import { can } from '@/lib/auth/permissions';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { validateWeights } from '@/lib/consultant-selection/scoring';
import { limitSelectionWrite } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

/**
 * Server actions that persist consultant-selection state to Supabase.
 *
 * Access is gated by the RBAC matrix (selection.manage / selection.evaluate)
 * and, at the row level, by the org-scoped RLS policies in migration 008.
 * Criteria changes are rejected once a criteria set is locked — both here and
 * by the enforce_criteria_lock() DB trigger (defense in depth).
 */

const createProcessSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  complexity: z.enum(['commercial', 'mega']).default('commercial'),
  selectionMethod: z.enum(['QBS', 'QCBS', 'LCS', 'FBS', 'SSS']).optional(),
});

export async function createProcess(
  input: z.infer<typeof createProcessSchema>,
): Promise<ActionResult<{ processId: string }>> {
  const parsed = createProcessSchema.safeParse(input);
  if (!parsed.success) return err('Validation failed', parsed.error.flatten().fieldErrors);

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');
  if (can(actor.platformRole, actor.stakeholderType, 'selection.manage') === 'deny')
    return err('Forbidden');

  if (!(await limitSelectionWrite(actor.userId)))
    return err('Rate limit reached. Please try again later.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('selection_processes')
    .insert({
      organization_id: actor.orgId,
      created_by: actor.userId,
      title: parsed.data.title,
      complexity: parsed.data.complexity,
      selection_method: parsed.data.selectionMethod ?? null,
    })
    .select('id')
    .single();

  if (error || !data) return err('Could not create selection process');
  return ok({ processId: data.id as string });
}

const criterionSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  weight: z.number().min(0).max(100),
  maxScore: z.number().int().positive().default(10),
  dimension: z.enum(['technical', 'financial']),
  guidance: z.string().optional(),
});

const saveCriteriaSchema = z.object({
  processId: z.string().uuid(),
  criteria: z.array(criterionSchema).min(1),
  /** when true, the weights must total 100 and the set is locked */
  lock: z.boolean().default(false),
});

/**
 * Create (or replace the draft of) a process's criteria set and its criteria.
 * When `lock` is true, weights must sum to 100 and the set is locked so that
 * criteria can no longer change without a new version.
 */
export async function saveCriteriaSet(
  input: z.infer<typeof saveCriteriaSchema>,
): Promise<ActionResult<{ criteriaSetId: string; locked: boolean }>> {
  const parsed = saveCriteriaSchema.safeParse(input);
  if (!parsed.success) return err('Validation failed', parsed.error.flatten().fieldErrors);

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');
  if (can(actor.platformRole, actor.stakeholderType, 'selection.manage') === 'deny')
    return err('Forbidden');

  if (parsed.data.lock) {
    const weights = validateWeights(
      parsed.data.criteria.map((c, i) => ({
        id: String(i),
        key: c.key,
        label: c.label,
        weight: c.weight,
        maxScore: c.maxScore,
        dimension: c.dimension,
      })),
    );
    if (!weights.ok)
      return err(`Weights total ${weights.sum}% — they must equal 100% before locking.`);
  }

  if (!(await limitSelectionWrite(actor.userId)))
    return err('Rate limit reached. Please try again later.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  // Find the existing draft set for this process, or create version 1.
  const { data: existing } = await supabase
    .from('criteria_sets')
    .select('id, status, version')
    .eq('process_id', parsed.data.processId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.status === 'locked') {
    return err('The criteria set is locked. Create a new version to change criteria.');
  }

  let criteriaSetId = existing?.id as string | undefined;
  if (!criteriaSetId) {
    const { data: created, error: csErr } = await supabase
      .from('criteria_sets')
      .insert({ process_id: parsed.data.processId, version: 1, status: 'draft' })
      .select('id')
      .single();
    if (csErr || !created) return err('Could not create criteria set');
    criteriaSetId = created.id as string;
  } else {
    // Replace the draft's criteria.
    await supabase.from('criteria').delete().eq('criteria_set_id', criteriaSetId);
  }

  const { error: critErr } = await supabase.from('criteria').insert(
    parsed.data.criteria.map((c) => ({
      criteria_set_id: criteriaSetId,
      key: c.key,
      label: c.label,
      weight: c.weight,
      max_score: c.maxScore,
      dimension: c.dimension,
      guidance: c.guidance ?? null,
    })),
  );
  if (critErr) return err('Could not save criteria');

  if (parsed.data.lock) {
    const { error: lockErr } = await supabase
      .from('criteria_sets')
      .update({
        status: 'locked',
        approved_by: actor.userId,
        approved_at: new Date().toISOString(),
      })
      .eq('id', criteriaSetId);
    if (lockErr) return err('Could not lock the criteria set');
  }

  return ok({ criteriaSetId, locked: parsed.data.lock });
}

const scoreSchema = z.object({
  criterionId: z.string().uuid(),
  raw: z.number().min(0),
  note: z.string().optional(),
});

const saveEvaluationSchema = z.object({
  processId: z.string().uuid(),
  consultantId: z.string().uuid(),
  criteriaSetVersion: z.number().int().positive(),
  scores: z.array(scoreSchema).min(1),
  submit: z.boolean().default(false),
});

/**
 * Persist one evaluator's scores for one consultant. Re-submitting replaces the
 * evaluator's prior scores for that consultant in this process.
 */
export async function saveEvaluation(
  input: z.infer<typeof saveEvaluationSchema>,
): Promise<ActionResult<{ evaluationId: string }>> {
  const parsed = saveEvaluationSchema.safeParse(input);
  if (!parsed.success) return err('Validation failed', parsed.error.flatten().fieldErrors);

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');
  if (can(actor.platformRole, actor.stakeholderType, 'selection.evaluate') === 'deny')
    return err('Forbidden');

  if (!(await limitSelectionWrite(actor.userId)))
    return err('Rate limit reached. Please try again later.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  // One evaluation per (process, consultant, evaluator).
  const { data: existing } = await supabase
    .from('evaluations')
    .select('id')
    .eq('process_id', parsed.data.processId)
    .eq('consultant_id', parsed.data.consultantId)
    .eq('evaluator_id', actor.userId)
    .maybeSingle();

  let evaluationId = existing?.id as string | undefined;
  if (!evaluationId) {
    const { data: created, error: evErr } = await supabase
      .from('evaluations')
      .insert({
        process_id: parsed.data.processId,
        consultant_id: parsed.data.consultantId,
        evaluator_id: actor.userId,
        criteria_set_version: parsed.data.criteriaSetVersion,
        submitted_at: parsed.data.submit ? new Date().toISOString() : null,
      })
      .select('id')
      .single();
    if (evErr || !created) return err('Could not create evaluation');
    evaluationId = created.id as string;
  } else {
    await supabase.from('evaluation_scores').delete().eq('evaluation_id', evaluationId);
    await supabase
      .from('evaluations')
      .update({ submitted_at: parsed.data.submit ? new Date().toISOString() : null })
      .eq('id', evaluationId);
  }

  const { error: scoreErr } = await supabase.from('evaluation_scores').insert(
    parsed.data.scores.map((s) => ({
      evaluation_id: evaluationId,
      criterion_id: s.criterionId,
      raw: s.raw,
      note: s.note ?? null,
    })),
  );
  if (scoreErr) return err('Could not save scores');

  return ok({ evaluationId });
}
