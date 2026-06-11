'use server';
import { getActiveOrg, requireRole } from '@/lib/auth/tenant';
import { inviteMember } from '@/lib/services/tenancy';
import { createClient } from '@/lib/supabase/server';

import type { OrgRole } from '@/lib/types/tenancy';

export async function sendInvitation(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' as const };
  const active = await getActiveOrg();
  if (!active?.orgId) return { success: false, error: 'No active organization' as const };
  if (!requireRole(active.orgRole, 'admin'))
    return { success: false, error: 'Insufficient permissions' as const };
  try {
    const inv = await inviteMember(
      active.orgId,
      formData.get('email') as string,
      (formData.get('role') as OrgRole) ?? 'member',
      active.userId,
    );
    return { success: true as const, data: inv };
  } catch (e) {
    return { success: false as const, error: (e as Error).message };
  }
}
