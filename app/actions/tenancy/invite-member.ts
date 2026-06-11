'use server';

import { createClient } from '@/lib/supabase/server';
import { getActiveOrg, requireRole } from '@/lib/auth/tenant';
import { inviteMember } from '@/lib/services/tenancy';
import type { OrgRole } from '@/lib/types/tenancy';

export async function sendInvitation(
  formData: FormData,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' };

  const active = await getActiveOrg();
  if (!active?.orgId) return { success: false, error: 'No active organization' };
  if (!requireRole(active.orgRole, 'admin')) return { success: false, error: 'Insufficient permissions' };

  try {
    await inviteMember(
      active.orgId,
      (formData.get('email') as string ?? '').trim().toLowerCase(),
      ((formData.get('role') as OrgRole) ?? 'member'),
      active.userId,
    );
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
