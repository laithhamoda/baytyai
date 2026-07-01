'use server';

import { z } from 'zod';

import { ok, err } from '@/lib/actions/types';
import { can } from '@/lib/auth/permissions';
import { isOrgVerified } from '@/lib/auth/require-verified';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { limitMarketplaceWrite } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

const schema = z.object({
  inquiryId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  notes: z.string().default(''),
});

/** Submit a quotation against a published inquiry. Gated by quotation.submit. */
export async function submitQuotation(
  input: z.infer<typeof schema>,
): Promise<ActionResult<{ quotationId: string }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return err('Validation failed');

  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (!actor.orgId) return err('No organization');

  if (can(actor.platformRole, actor.stakeholderType, 'quotation.submit') !== 'allow') {
    return err('Forbidden');
  }

  if (!(await limitMarketplaceWrite(actor.userId)))
    return err('Rate limit reached. Please try again later.');

  // Marketplace access gate: only verified orgs may transact.
  if (!(await isOrgVerified(actor))) {
    return err('Your organization must be verified before submitting quotations.');
  }

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('quotations')
    .insert({
      inquiry_id: parsed.data.inquiryId,
      organization_id: actor.orgId,
      created_by: actor.userId,
      amount: parsed.data.amount,
      currency: parsed.data.currency,
      notes: parsed.data.notes,
      status: 'submitted',
    })
    .select('id')
    .single();

  if (error || !data) return err('Could not submit quotation');

  await writeAuditLog({
    userId: actor.userId,
    action: 'quotation.submitted',
    entityType: 'quotation',
    entityId: data.id,
    metadata: { inquiryId: parsed.data.inquiryId },
  });

  return ok({ quotationId: data.id });
}
