import { createClient } from '@/lib/supabase/server';

import type { ActiveOrg } from '@/lib/types/tenancy';

export async function getActiveOrg(): Promise<ActiveOrg | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const meta = user.app_metadata as Record<string, string | undefined>;
  return {
    userId: user.id,
    orgId: meta.org_id ?? null,
    orgRole: (meta.org_role as ActiveOrg['orgRole']) ?? null,
    isAdmin: (user.user_metadata as Record<string, unknown>)?.role === 'admin',
  };
}

export function requireRole(
  current: ActiveOrg['orgRole'],
  minimum: NonNullable<ActiveOrg['orgRole']>,
): boolean {
  const RANK: Record<NonNullable<ActiveOrg['orgRole']>, number> = {
    owner: 5,
    admin: 4,
    manager: 3,
    member: 2,
    viewer: 1,
  };
  if (!current) return false;
  return RANK[current] >= RANK[minimum];
}
