'use server';

import { ok, err } from '@/lib/actions/types';
import { writeAuditLog } from '@/lib/db/audit';
import { getDraftById } from '@/lib/db/projects';
import { docUploadRatelimit } from '@/lib/rate-limit';
import { createClient } from '@/lib/supabase/server';
import { DOCUMENT_TYPES } from '@/lib/validations/project/step-4-schema';

import type { ActionResult } from '@/lib/actions/types';
import type { DocumentType, UploadedDocument } from '@/lib/validations/project/step-4-schema';

const ALLOWED_MIME_TYPES = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB

export async function uploadDocument(
  projectId: string,
  documentType: DocumentType,
  formData: FormData,
): Promise<ActionResult<UploadedDocument>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  const { success: rateLimitOk } = await docUploadRatelimit.limit(user.id);
  if (!rateLimitOk) return err('Upload limit reached. Try again later.');

  if (!(DOCUMENT_TYPES as readonly string[]).includes(documentType)) {
    return err('Invalid document type');
  }

  const draft = await getDraftById(projectId, user.id);
  if (!draft) return err('Project not found');
  if (draft.status !== 'draft') return err('Cannot upload to a submitted project');

  const file = formData.get('file');
  if (!(file instanceof File)) return err('No file provided');

  if (file.size > MAX_FILE_SIZE) return err('File exceeds 25 MB limit');
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return err('Only PDF, JPG, PNG, and WEBP files are allowed');
  }

  const ext = file.name.split('.').pop() ?? 'bin';
  const storagePath = `${user.id}/${projectId}/${documentType}_${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('project-documents')
    .upload(storagePath, file, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) return err(uploadError.message);

  const doc: UploadedDocument = {
    id: crypto.randomUUID(),
    document_type: documentType,
    file_name: file.name,
    storage_path: storagePath,
    file_size_bytes: file.size,
    mime_type: file.type,
    uploaded_at: new Date().toISOString(),
  };

  const { error: dbError } = await supabase.from('project_documents').insert({
    id: doc.id,
    project_id: projectId,
    user_id: user.id,
    document_type: documentType,
    file_name: file.name,
    storage_path: storagePath,
    file_size_bytes: file.size,
    mime_type: file.type,
  });

  if (dbError) {
    await supabase.storage.from('project-documents').remove([storagePath]);
    return err(dbError.message);
  }

  await writeAuditLog({
    userId: user.id,
    action: 'project.document_uploaded',
    entityType: 'document',
    entityId: doc.id,
    metadata: { projectId, documentType, fileName: file.name },
  });

  return ok(doc);
}
