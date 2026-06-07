'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { CONTENT_FIELDS } from '@/lib/cms';
import { getSessionUser } from '@/lib/supabase/auth';
import { createClient } from '@/lib/supabase/server';

async function assertAdmin() {
  const user = await getSessionUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Not authorised.');
  }
  return user;
}

/** Upsert edited content fields. Admin only. */
export async function saveContent(formData: FormData): Promise<void> {
  await assertAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error('Backend not configured.');

  const rows = CONTENT_FIELDS.map((f) => ({
    key: f.key,
    value: (formData.get(f.key) as string | null) ?? '',
  })).filter((r) => formData.has(r.key));

  if (rows.length > 0) {
    const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' });
    if (error) throw new Error(error.message);
  }

  // Refresh the public pages that consume CMS content.
  revalidatePath('/');
  revalidatePath('/admin');
}

/** Upload an image/file to the public `media` bucket. Returns its public URL. */
export async function uploadMedia(formData: FormData): Promise<{ url: string }> {
  await assertAdmin();
  const supabase = await createClient();
  if (!supabase) throw new Error('Backend not configured.');

  const file = formData.get('file') as File | null;
  if (!file || file.size === 0) throw new Error('No file provided.');

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${Date.now()}_${safeName}`;

  const { error } = await supabase.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });
  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return { url: data.publicUrl };
}

export async function signOutUser(): Promise<void> {
  const supabase = await createClient();
  if (supabase) await supabase.auth.signOut();
  redirect('/');
}
