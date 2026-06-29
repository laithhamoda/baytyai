'use server';

import { requestApproval } from '@/app/actions/approvals/request';
import { ok, err } from '@/lib/actions/types';
import { can } from '@/lib/auth/permissions';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

/**
 * Award a quotation. Gated by quotation.award:
 *  - 'allow'             → status 'awarded' immediately
 *  - 'requires_approval' → status 'under_review' + approvals row
 */
export async function awardQuotation(
  quotationId: string,
): Promise<ActionResult<{ status: string }>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');

  const decision = can(actor.platformRole, actor.stakeholderType, 'quotation.award');
  if (decision === 'deny') return err('Forbidden');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const status = decision === 'requires_approval' ? 'under_review' : 'awarded';

  const { data, error } = await supabase
    .from('quotations')
    .update({ status })
    .eq('id', quotationId)
    .select('id')
    .maybeSingle();

  if (error) return err('Could not award');
  if (!data) return err('Quotation not found or not permitted');

  if (decision === 'requires_approval') {
    await requestApproval({
      entityType: 'quotation',
      entityId: quotationId,
      organizationId: actor.orgId,
      requestedBy: actor.userId,
    });
  }

  await writeAuditLog({
    userId: actor.userId,
    action: 'quotation.award_requested',
    entityType: 'quotation',
    entityId: quotationId,
    metadata: { status, decision },
  });

  return ok({ status });
}
