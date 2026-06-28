'use server';

import { acceptInvitation } from '@/lib/repositories/organizations';
import { createClient } from '@/lib/supabase/server';

export async function acceptInvite(
  token: string,
): Promise<{ success: true } | { success: false; error: string }> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'unauthenticated' };

  try {
    await acceptInvitation(token, user.id);
    return { success: true };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
