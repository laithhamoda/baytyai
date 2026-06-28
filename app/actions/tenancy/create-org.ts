'use server';

import { createOrgWithOwner } from '@/lib/services/tenancy';
import { createClient } from '@/lib/supabase/server';

export async function createOrg(
  formData: FormData,
): Promise<
  | { success: true; data: { id: string; name: string; slug: string } }
  | { success: false; error: string }
> {
  const supabase = await createClient();
  if (!supabase) return { success: false, error: 'Service unavailable' };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Unauthenticated' };

  try {
    const org = await createOrgWithOwner(
      {
        name: ((formData.get('name') as string) ?? '').trim(),
        slug: ((formData.get('slug') as string) ?? '').trim(),
      },
      user.id,
    );
    return { success: true, data: { id: org.id, name: org.name, slug: org.slug } };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}
