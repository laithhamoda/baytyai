import { createClient } from '@/lib/supabase/server';
import type { ActiveOrg, OrgRole } from '@/lib/types/tenancy';

export async function getActiveOrg(): Promise<ActiveOrg | null> {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const meta = user.app_metadata as Record<string, string | undefined>;
  return {
    userId:  user.id,
    orgId:   meta.org_id   ?? null,
    orgRole: (meta.org_role as OrgRole) ?? null,
    isAdmin: (user.user_metadata as Record<string, unknown>)?.role === 'admin',
  };
}

const ROLE_RANK: Record<OrgRole, number> = {
  owner: 5, admin: 4, manager: 3, member: 2, viewer: 1,
};

export function requireRole(
  current: OrgRole | null,
  minimum: OrgRole,
): boolean {
  if (!current) return false;
  return ROLE_RANK[current] >= ROLE_RANK[minimum];
}
