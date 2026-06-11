import { createClient } from '@/lib/supabase/server';

import type { Organization, Membership, Invitation, OrgRole } from '@/lib/types/tenancy';

export async function getOrganization(orgId: string): Promise<Organization | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data } = await supabase.from('organizations').select('*').eq('id', orgId).single();
  return data ?? null;
}

export async function createOrganization(
  name: string,
  slug: string,
  userId: string,
): Promise<Organization> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');
  const { data, error } = await supabase
    .from('organizations')
    .insert({ name, slug, created_by: userId })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getMembers(
  orgId: string,
): Promise<(Membership & { profile: { full_name: string; avatar_url: string | null } })[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from('memberships')
    .select('*, profile:profiles(full_name, avatar_url)')
    .eq('organization_id', orgId)
    .eq('status', 'active')
    .order('created_at');
  return (data ?? []) as (Membership & {
    profile: { full_name: string; avatar_url: string | null };
  })[];
}

export async function createMembership(
  orgId: string,
  userId: string,
  role: OrgRole,
  invitedBy?: string,
): Promise<Membership> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');
  const { data, error } = await supabase
    .from('memberships')
    .insert({ organization_id: orgId, user_id: userId, role, invited_by: invitedBy })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function createInvitation(
  orgId: string,
  email: string,
  role: OrgRole,
  invitedBy: string,
): Promise<Invitation> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');
  const { data, error } = await supabase
    .from('invitations')
    .upsert(
      { organization_id: orgId, email, role, invited_by: invitedBy },
      { onConflict: 'organization_id,email', ignoreDuplicates: false },
    )
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function acceptInvitation(token: string, userId: string): Promise<void> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');
  const { data: inv, error: fetchErr } = await supabase
    .from('invitations')
    .select('*')
    .eq('token', token)
    .is('accepted_at', null)
    .gt('expires_at', new Date().toISOString())
    .single();
  if (fetchErr || !inv) throw new Error('Invitation not found or expired');
  await createMembership(inv.organization_id, userId, inv.role as OrgRole, inv.invited_by);
  await supabase
    .from('invitations')
    .update({ accepted_at: new Date().toISOString() })
    .eq('id', inv.id);
}
