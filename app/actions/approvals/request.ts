'use server';

import { ok, err } from '@/lib/actions/types';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

interface RequestApprovalInput {
  entityType: 'inquiry' | 'quotation' | 'project' | 'document';
  entityId: string;
  organizationId: string;
  requestedBy: string;
}

/**
 * Create a pending approval row for a gated action. Reusable engine — any new
 * gated action calls this without schema changes.
 */
export async function requestApproval(
  input: RequestApprovalInput,
): Promise<ActionResult<{ approvalId: string }>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('approvals')
    .insert({
      entity_type: input.entityType,
      entity_id: input.entityId,
      organization_id: input.organizationId,
      requested_by: input.requestedBy,
      approver_role: 'admin',
      status: 'pending',
    })
    .select('id')
    .single();

  if (error || !data) return err('Could not create approval request');

  await writeAuditLog({
    userId: input.requestedBy,
    action: 'approval.requested',
    entityType: input.entityType,
    entityId: input.entityId,
    metadata: { approvalId: data.id },
  });

  return ok({ approvalId: data.id });
}
