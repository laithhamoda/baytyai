'use server';

import { z } from 'zod';

import { requestApproval } from '@/app/actions/approvals/request';
import { ok, err } from '@/lib/actions/types';
import { can } from '@/lib/auth/permissions';
import { isOrgVerified } from '@/lib/auth/require-verified';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

const schema = z.object({
  title: z.string().min(3),
  description: z.string().default(''),
  region: z.string().optional(),
  budgetBand: z.string().optional(),
});

/**
 * Create an inquiry. Role decides the outcome:
 *  - 'allow'             → status 'published'
 *  - 'requires_approval' → status 'pending_approval' + an approvals row
 *  - 'deny'              → rejected
 */
export async function createInquiry(
  input: z.infer<typeof schema>,
): Promise<ActionResult<{ inquiryId: string; status: string }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return err('Validation failed');

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');

  const decision = can(actor.platformRole, actor.stakeholderType, 'inquiry.post');
  if (decision === 'deny') return err('Forbidden');

  // Marketplace access gate: only verified orgs may post inquiries.
  if (!(await isOrgVerified(actor))) {
    return err('Your organization must be verified before posting inquiries.');
  }

  const status = decision === 'requires_approval' ? 'pending_approval' : 'published';

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('inquiries')
    .insert({
      organization_id: actor.orgId,
      created_by: actor.userId,
      title: parsed.data.title,
      description: parsed.data.description,
      region: parsed.data.region ?? null,
      budget_band: parsed.data.budgetBand ?? null,
      status,
    })
    .select('id')
    .single();

  if (error || !data) return err('Could not create inquiry');

  if (decision === 'requires_approval') {
    await requestApproval({
      entityType: 'inquiry',
      entityId: data.id,
      organizationId: actor.orgId,
      requestedBy: actor.userId,
    });
  }

  await writeAuditLog({
    userId: actor.userId,
    action: 'inquiry.created',
    entityType: 'inquiry',
    entityId: data.id,
    metadata: { status, decision },
  });

  return ok({ inquiryId: data.id, status });
}
