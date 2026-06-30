'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { explainRanking, rankConsultants } from '@/lib/consultant-selection/scoring';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';
import type {
  Criterion,
  Evaluation,
  RankedConsultant,
  RankingExplanation,
} from '@/lib/consultant-selection/types';

export interface LoadedProcess {
  id: string;
  title: string;
  complexity: 'commercial' | 'mega';
  selectionMethod: string | null;
  stage: string;
  criteriaSetVersion: number | null;
  criteriaLocked: boolean;
  criteria: Criterion[];
  consultants: { id: string; name: string }[];
  ranked: RankedConsultant[];
  explanation: RankingExplanation | null;
}

/**
 * Load a selection process with its locked/draft criteria, consultants, and
 * submitted evaluations, then compute the ranking and explanation server-side.
 * RLS guarantees the caller can only read processes in their own org.
 */
export async function loadProcess(processId: string): Promise<ActionResult<LoadedProcess>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: proc, error: procErr } = await supabase
    .from('selection_processes')
    .select('id, title, complexity, selection_method, stage')
    .eq('id', processId)
    .maybeSingle();
  if (procErr || !proc) return err('Process not found');

  const { data: critSet } = await supabase
    .from('criteria_sets')
    .select('id, version, status')
    .eq('process_id', processId)
    .order('version', { ascending: false })
    .limit(1)
    .maybeSingle();

  let criteria: Criterion[] = [];
  if (critSet?.id) {
    const { data: critRows } = await supabase
      .from('criteria')
      .select('id, key, label, weight, max_score, dimension, guidance')
      .eq('criteria_set_id', critSet.id);
    criteria = (critRows ?? []).map((c) => ({
      id: c.id as string,
      key: c.key as string,
      label: c.label as string,
      weight: Number(c.weight),
      maxScore: Number(c.max_score),
      dimension: c.dimension as 'technical' | 'financial',
      guidance: (c.guidance as string | null) ?? undefined,
    }));
  }

  const { data: consultantRows } = await supabase
    .from('consultants')
    .select('id, name')
    .eq('process_id', processId);
  const consultants = (consultantRows ?? []).map((c) => ({
    id: c.id as string,
    name: c.name as string,
  }));

  // Evaluations + their scores for this process.
  const { data: evalRows } = await supabase
    .from('evaluations')
    .select('id, consultant_id, evaluator_id, criteria_set_version, submitted_at')
    .eq('process_id', processId);

  const evaluations: Evaluation[] = [];
  for (const e of evalRows ?? []) {
    const { data: scoreRows } = await supabase
      .from('evaluation_scores')
      .select('criterion_id, raw, note')
      .eq('evaluation_id', e.id as string);
    evaluations.push({
      id: e.id as string,
      processId,
      consultantId: e.consultant_id as string,
      evaluatorId: e.evaluator_id as string,
      criteriaSetVersion: Number(e.criteria_set_version),
      submittedAt: (e.submitted_at as string | null) ?? undefined,
      scores: (scoreRows ?? []).map((s) => ({
        criterionId: s.criterion_id as string,
        raw: Number(s.raw),
        note: (s.note as string | null) ?? undefined,
      })),
    });
  }

  const ranked = rankConsultants(criteria, consultants, evaluations);
  const explanation = explainRanking(ranked);

  return ok({
    id: proc.id as string,
    title: proc.title as string,
    complexity: proc.complexity as 'commercial' | 'mega',
    selectionMethod: (proc.selection_method as string | null) ?? null,
    stage: proc.stage as string,
    criteriaSetVersion: critSet ? Number(critSet.version) : null,
    criteriaLocked: critSet?.status === 'locked',
    criteria,
    consultants,
    ranked,
    explanation,
  });
}
