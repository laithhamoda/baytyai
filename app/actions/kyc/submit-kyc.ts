'use server';

import { ok, err } from '@/lib/actions/types';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export async function uploadKycDocument(
  field: 'id_front' | 'id_back' | 'selfie',
  formData: FormData,
): Promise<ActionResult<{ storagePath: string }>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  const file = formData.get('file');
  if (!(file instanceof File)) return err('No file provided');
  if (file.size > 10 * 1024 * 1024) return err('File exceeds 10 MB limit');

  const allowed = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/heic']);
  if (!allowed.has(file.type)) return err('Only JPG, PNG, WEBP, or HEIC images are accepted');

  const ext = file.name.split('.').pop() ?? 'jpg';
  const storagePath = `${user.id}/${field}_${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from('identity-documents')
    .upload(storagePath, file, { contentType: file.type, upsert: true });

  if (error) return err(error.message);

  return ok({ storagePath });
}

export async function submitKyc(payload: {
  fullName: string;
  email: string;
  phone: string;
  nationality: string;
  idFrontPath: string;
  idBackPath: string;
  selfiePath: string;
}): Promise<ActionResult<undefined>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  // Upsert so re-submissions overwrite the pending record
  const { error } = await supabase.from('identity_verifications').upsert(
    {
      user_id: user.id,
      full_name: payload.fullName,
      email: payload.email,
      phone: payload.phone,
      nationality: payload.nationality,
      id_front_path: payload.idFrontPath,
      id_back_path: payload.idBackPath,
      selfie_path: payload.selfiePath,
      status: 'pending_review',
      submitted_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) return err(error.message);

  return ok(undefined);
}
