'use server';

import { resolveActor } from '@/lib/auth/resolve-actor';
import { createClient } from '@/lib/supabase/server';

export interface ApprovalRow {
  id: string;
  entity_type: string;
  entity_id: string;
  organization_id: string | null;
  requested_by: string;
  status: string;
  reason: string | null;
  created_at: string;
}

/** Pending approvals for the admin queue. RLS already restricts to admins/own-org. */
export async function listPendingApprovals(): Promise<ApprovalRow[]> {
  const actor = await resolveActor();
  if (!actor || actor.platformRole !== 'admin') return [];

  const supabase = await createClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from('approvals')
    .select('id, entity_type, entity_id, organization_id, requested_by, status, reason, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true });

  return (data ?? []) as ApprovalRow[];
}
