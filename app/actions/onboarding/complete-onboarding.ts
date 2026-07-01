'use server';

import { z } from 'zod';

import { ok, err } from '@/lib/actions/types';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';
import type { StakeholderType } from '@/lib/auth/permissions';

const STAKEHOLDER_TYPES: StakeholderType[] = [
  'client',
  'consultant',
  'contractor',
  'subcontractor',
  'supplier',
];

const schema = z.object({
  name: z.string().min(2, 'Organization name is required'),
  stakeholderType: z.enum(['client', 'consultant', 'contractor', 'subcontractor', 'supplier']),
  // Professional details captured up-front so an admin can verify the entry.
  country: z.string().min(2, 'Country is required'),
  registrationNumber: z.string().min(2, 'Company registration / trade-license number is required'),
  website: z.string().max(200).optional().or(z.literal('')),
  phone: z.string().max(40).optional().or(z.literal('')),
  contactName: z.string().max(120).optional().or(z.literal('')),
});

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'org'
  );
}

/**
 * Create the user's organization with a stakeholder_type and make them its
 * owner. This is the keystone that lets can()/RLS resolve permissions for a
 * non-admin user. Idempotent-ish: refuses if the user already has an org.
 */
export async function completeOnboarding(input: {
  name: string;
  stakeholderType: string;
  country: string;
  registrationNumber: string;
  website?: string;
  phone?: string;
  contactName?: string;
}): Promise<ActionResult<{ organizationId: string }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    return err(parsed.error.issues[0]?.message ?? 'Validation failed');
  }

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  // Already onboarded? Don't create a second org.
  const { data: existing } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  if (existing) return ok({ organizationId: existing.organization_id });

  // Unique-ish slug.
  const slug = `${slugify(parsed.data.name)}-${user.id.slice(0, 6)}`;

  // Compose the professional details into the verification notes the admin
  // review queue displays, and submit the org for manual verification up-front.
  const details = [
    `Registration/License: ${parsed.data.registrationNumber}`,
    `Country: ${parsed.data.country}`,
    parsed.data.website ? `Website: ${parsed.data.website}` : null,
    parsed.data.contactName ? `Contact: ${parsed.data.contactName}` : null,
    parsed.data.phone ? `Phone: ${parsed.data.phone}` : null,
    `Signup email: ${user.email ?? '—'}`,
  ]
    .filter(Boolean)
    .join(' · ');

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({
      name: parsed.data.name,
      slug,
      stakeholder_type: parsed.data.stakeholderType,
      created_by: user.id,
      verification_status: 'pending',
      verification_requested_at: new Date().toISOString(),
      verification_notes: details,
    })
    .select('id')
    .single();

  if (orgErr || !org) return err('Could not create organization');

  const { error: memErr } = await supabase.from('memberships').insert({
    organization_id: org.id,
    user_id: user.id,
    role: 'owner',
    status: 'active',
  });
  if (memErr) return err('Could not create membership');

  await writeAuditLog({
    userId: user.id,
    action: 'org.created',
    entityType: 'organization',
    entityId: org.id,
    metadata: { stakeholderType: parsed.data.stakeholderType },
  });

  return ok({ organizationId: org.id });
}

export { STAKEHOLDER_TYPES };
