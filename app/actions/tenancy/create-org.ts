'use server';
import { createOrgWithOwner } from '@/lib/services/tenancy';
import { createClient } from '@/lib/supabase/server';

export async function createOrg(formData: FormData) {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' as const };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' as const };
  try {
    const org = await createOrgWithOwner(
      { name: formData.get('name') as string, slug: formData.get('slug') as string },
      user.id,
    );
    return { success: true as const, data: org };
  } catch (e) {
    return { success: false as const, error: (e as Error).message };
  }
}
