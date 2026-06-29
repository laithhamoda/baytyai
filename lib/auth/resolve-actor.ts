import { createClient } from '@/lib/supabase/server';

import type { PlatformRole, StakeholderType } from './permissions';

export interface Actor {
  userId: string;
  orgId: string | null;
  platformRole: PlatformRole;
  stakeholderType: StakeholderType | null;
}

/**
 * Re-derive the caller's identity, platform role, org, and stakeholder type from
 * the trusted server session. Never accept these from the client. Returns null
 * if unauthenticated.
 */
export async function resolveActor(): Promise<Actor | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id, organizations(stakeholder_type)')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  const org = membership?.organizations as { stakeholder_type?: StakeholderType } | null;

  return {
    userId: user.id,
    orgId: membership?.organization_id ?? null,
    platformRole: profile?.role === 'admin' ? 'admin' : 'user',
    stakeholderType: org?.stakeholder_type ?? null,
  };
}
