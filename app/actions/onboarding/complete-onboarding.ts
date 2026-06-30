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

  const { data: org, error: orgErr } = await supabase
    .from('organizations')
    .insert({
      name: parsed.data.name,
      slug,
      stakeholder_type: parsed.data.stakeholderType,
      created_by: user.id,
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
