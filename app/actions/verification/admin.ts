'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export interface PendingVerification {
  orgId: string;
  name: string;
  stakeholderType: string;
  requestedAt: string | null;
  notes: string | null;
}

/** Admin-only: list organizations awaiting manual verification. */
export async function listPendingVerifications(): Promise<ActionResult<PendingVerification[]>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (actor.platformRole !== 'admin') return err('Forbidden');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('organizations')
    .select('id, name, stakeholder_type, verification_requested_at, verification_notes')
    .eq('verification_status', 'pending')
    .order('verification_requested_at', { ascending: true });

  if (error) return err('Could not load verification queue');

  return ok(
    (data ?? []).map((o) => ({
      orgId: o.id as string,
      name: o.name as string,
      stakeholderType: (o.stakeholder_type as string) ?? '—',
      requestedAt: (o.verification_requested_at as string | null) ?? null,
      notes: (o.verification_notes as string | null) ?? null,
    })),
  );
}

/** Admin-only: approve or reject an organization's verification. Manual decision. */
export async function decideVerification(input: {
  orgId: string;
  decision: 'verified' | 'rejected';
  notes?: string;
}): Promise<ActionResult<{ status: string }>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (actor.platformRole !== 'admin') return err('Forbidden');
  if (input.decision === 'rejected' && !input.notes?.trim())
    return err('A reason is required to reject.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { error } = await supabase
    .from('organizations')
    .update({
      verification_status: input.decision,
      verified_at: input.decision === 'verified' ? new Date().toISOString() : null,
      verified_by: actor.userId,
      verification_notes: input.notes?.trim() || null,
    })
    .eq('id', input.orgId)
    .eq('verification_status', 'pending');

  if (error) return err('Could not record the decision');

  await writeAuditLog({
    userId: actor.userId,
    action: input.decision === 'verified' ? 'verification.approved' : 'verification.rejected',
    entityType: 'organization',
    entityId: input.orgId,
    metadata: { notes: input.notes ?? null },
  });

  return ok({ status: input.decision });
}
