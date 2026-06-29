'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

/** Publish a draft inquiry that does not require approval (own org only). */
export async function publishInquiry(inquiryId: string): Promise<ActionResult<undefined>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  // RLS restricts the update to the caller's org / admin.
  const { data, error } = await supabase
    .from('inquiries')
    .update({ status: 'published' })
    .eq('id', inquiryId)
    .eq('status', 'draft')
    .select('id')
    .maybeSingle();

  if (error) return err('Could not publish');
  if (!data) return err('Inquiry not found or not in draft');

  await writeAuditLog({
    userId: actor.userId,
    action: 'inquiry.published',
    entityType: 'inquiry',
    entityId: inquiryId,
  });

  return ok(undefined);
}
