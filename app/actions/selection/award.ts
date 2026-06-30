'use server';

import { z } from 'zod';

import { ok, err } from '@/lib/actions/types';
import { can } from '@/lib/auth/permissions';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

const schema = z.object({
  processId: z.string().uuid(),
  recommendedConsultantId: z.string().uuid().nullable().optional(),
  rationale: z.string().optional(),
  /** the ranking snapshot at award time — stored verbatim for the audit trail */
  rankingSnapshot: z.array(z.unknown()).default([]),
});

/**
 * Persist an award recommendation for a selection process: the recommended
 * consultant, a rationale, and a frozen snapshot of the ranking at award time.
 * RBAC-gated (selection.manage) and org-scoped by RLS (migration 008).
 */
export async function saveAwardRecommendation(
  input: z.infer<typeof schema>,
): Promise<ActionResult<{ awardId: string }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return err('Validation failed', parsed.error.flatten().fieldErrors);

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');
  if (can(actor.platformRole, actor.stakeholderType, 'selection.manage') === 'deny')
    return err('Forbidden');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('award_recommendations')
    .insert({
      process_id: parsed.data.processId,
      recommended_id: parsed.data.recommendedConsultantId ?? null,
      rationale: parsed.data.rationale ?? null,
      ranking_snapshot: parsed.data.rankingSnapshot,
      created_by: actor.userId,
    })
    .select('id')
    .single();

  if (error || !data) return err('Could not save the award recommendation');

  // Advance the process stage to 'award'.
  await supabase
    .from('selection_processes')
    .update({ stage: 'award', updated_at: new Date().toISOString() })
    .eq('id', parsed.data.processId);

  return ok({ awardId: data.id as string });
}
