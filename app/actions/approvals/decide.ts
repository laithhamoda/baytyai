'use server';

import { revalidatePath } from 'next/cache';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

interface DecideInput {
  approvalId: string;
  decision: 'approved' | 'rejected';
  reason?: string;
}

// When an approval is granted, the gated entity advances to this status.
const APPROVED_ENTITY_STATUS: Record<string, { table: string; status: string }> = {
  inquiry: { table: 'inquiries', status: 'published' },
  quotation: { table: 'quotations', status: 'awarded' },
  project: { table: 'projects', status: 'submitted' },
};

export async function decideApproval(input: DecideInput): Promise<ActionResult<undefined>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (actor.platformRole !== 'admin') return err('Forbidden'); // only platform admins decide

  if (input.decision === 'rejected' && !input.reason?.trim()) {
    return err('A reason is required to reject.');
  }

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: approval, error: fetchErr } = await supabase
    .from('approvals')
    .select('id, entity_type, entity_id, status')
    .eq('id', input.approvalId)
    .single();

  if (fetchErr || !approval) return err('Approval not found');
  if (approval.status !== 'pending') return err('Approval already decided');

  const { error: updErr } = await supabase
    .from('approvals')
    .update({
      status: input.decision,
      reason: input.reason ?? null,
      decided_by: actor.userId,
      decided_at: new Date().toISOString(),
    })
    .eq('id', input.approvalId);

  if (updErr) return err('Could not record decision');

  // On approval, advance the gated entity.
  if (input.decision === 'approved') {
    const target = APPROVED_ENTITY_STATUS[approval.entity_type];
    if (target) {
      await supabase
        .from(target.table)
        .update({ status: target.status })
        .eq('id', approval.entity_id);
    }
  }

  await writeAuditLog({
    userId: actor.userId,
    action: `approval.${input.decision}`,
    entityType: approval.entity_type,
    entityId: approval.entity_id,
    metadata: { approvalId: approval.id, reason: input.reason ?? null },
  });

  revalidatePath('/admin/approvals');
  return ok(undefined);
}
