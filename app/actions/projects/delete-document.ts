'use server';

import { ok, err } from '@/lib/actions/types';
import { writeAuditLog } from '@/lib/db/audit';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export async function deleteDocument(
  documentId: string,
  projectId: string,
): Promise<ActionResult<undefined>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  const { data: doc, error: fetchError } = await supabase
    .from('project_documents')
    .select('id, storage_path, project_id, user_id')
    .eq('id', documentId)
    .eq('project_id', projectId)
    .eq('user_id', user.id)
    .maybeSingle();

  if (fetchError || !doc) return err('Document not found');

  const { data: project } = await supabase
    .from('projects')
    .select('status')
    .eq('id', projectId)
    .eq('user_id', user.id)
    .maybeSingle();

  if ((project as { status: string } | null)?.status !== 'draft') {
    return err('Cannot delete documents from a submitted project');
  }

  const { error: dbError } = await supabase
    .from('project_documents')
    .delete()
    .eq('id', documentId)
    .eq('user_id', user.id);

  if (dbError) return err(dbError.message);

  await supabase.storage
    .from('project-documents')
    .remove([(doc as { storage_path: string }).storage_path]);

  await writeAuditLog({
    userId: user.id,
    action: 'project.document_deleted',
    entityType: 'document',
    entityId: documentId,
    metadata: { projectId },
  });

  return ok(undefined);
}
