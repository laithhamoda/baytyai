'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { limitVerificationRequest } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export interface VerificationState {
  status: 'unverified' | 'pending' | 'verified' | 'rejected';
  requestedAt: string | null;
  verifiedAt: string | null;
  notes: string | null;
}

/** Read the caller's current org verification status for the dashboard. */
export async function getMyVerification(): Promise<ActionResult<VerificationState>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('organizations')
    .select('verification_status, verification_requested_at, verified_at, verification_notes')
    .eq('id', actor.orgId)
    .single();

  if (error || !data) return err('Could not load verification status');
  return ok({
    status: (data.verification_status as VerificationState['status']) ?? 'unverified',
    requestedAt: (data.verification_requested_at as string | null) ?? null,
    verifiedAt: (data.verified_at as string | null) ?? null,
    notes: (data.verification_notes as string | null) ?? null,
  });
}

/** An org owner requests manual verification. Sets status to 'pending'. */
export async function requestVerification(
  notes?: string,
): Promise<ActionResult<{ status: string }>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');

  if (!(await limitVerificationRequest(actor.userId)))
    return err('Too many verification requests. Please try again later.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase.rpc('request_org_verification', {
    notes: notes?.trim() || null,
  });
  if (error) return err('Could not submit verification request');

  await writeAuditLog({
    userId: actor.userId,
    action: 'verification.requested',
    entityType: 'organization',
    entityId: actor.orgId,
    metadata: { status: data },
  });

  return ok({ status: String(data) });
}
