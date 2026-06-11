'use server';
import { redirect } from 'next/navigation';

import { acceptInvitation } from '@/lib/repositories/organizations';
import { createClient } from '@/lib/supabase/server';

export async function acceptInvite(token: string) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' as const };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/invite/${token}`);
  try {
    await acceptInvitation(token, user.id);
    return { success: true as const };
  } catch (e) {
    return { success: false as const, error: (e as Error).message };
  }
}
