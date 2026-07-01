'use server';

import { z } from 'zod';

import { ok, err } from '@/lib/actions/types';
import { limitAccessRequest } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

const ORG_TYPES = [
  'government',
  'owner-developer',
  'consultant',
  'contractor',
  'subcontractor',
  'supplier',
] as const;

const schema = z.object({
  organizationName: z.string().min(2, 'Organization name is required'),
  organizationType: z.enum(ORG_TYPES),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('A valid work email is required'),
  country: z.string().min(2, 'Country is required'),
  phone: z.string().max(40).optional().or(z.literal('')),
  website: z.string().max(200).optional().or(z.literal('')),
  programName: z.string().max(200).optional().or(z.literal('')),
  programScale: z.string().max(60).optional().or(z.literal('')),
  message: z.string().max(2000).optional().or(z.literal('')),
  // Anti-bot: honeypot must be empty; elapsedMs enforces min time-on-form.
  website2: z.string().optional(),
  elapsedMs: z.number().optional(),
});

/**
 * Public (unauthenticated) enterprise access application. Anonymous INSERT is
 * permitted by RLS (migration 011); admins review it in the access queue.
 */
export async function submitAccessRequest(
  input: z.infer<typeof schema>,
): Promise<ActionResult<undefined>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) return err(parsed.error.issues[0]?.message ?? 'Validation failed');

  // Human checks (server-side).
  if (parsed.data.website2) return ok(undefined); // honeypot filled → silently accept, drop
  if ((parsed.data.elapsedMs ?? 0) < 1500)
    return err('That was a little too fast — please try again.');

  if (!(await limitAccessRequest(parsed.data.email.toLowerCase())))
    return err('We’ve received several requests from this email. Please try again later.');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { error } = await supabase.from('access_requests').insert({
    organization_name: parsed.data.organizationName.trim(),
    organization_type: parsed.data.organizationType,
    contact_name: parsed.data.contactName.trim(),
    email: parsed.data.email.trim().toLowerCase(),
    country: parsed.data.country.trim(),
    phone: parsed.data.phone?.trim() || null,
    website: parsed.data.website?.trim() || null,
    program_name: parsed.data.programName?.trim() || null,
    program_scale: parsed.data.programScale?.trim() || null,
    message: parsed.data.message?.trim() || null,
  });

  if (error) return err('Could not submit your request. Please try again.');
  return ok(undefined);
}
