import { createClient } from '@/lib/supabase/server';

type AuditAction =
  | 'project.draft_created'
  | 'project.step_saved'
  | 'project.document_uploaded'
  | 'project.document_deleted'
  | 'project.submitted'
  | 'project.status_changed'
  | 'org.created'
  | 'member.invited'
  | 'member.accepted'
  // RBAC / marketplace / approval engine
  | 'inquiry.created'
  | 'inquiry.published'
  | 'quotation.submitted'
  | 'quotation.award_requested'
  | 'approval.requested'
  | 'approval.approved'
  | 'approval.rejected'
  // Organization verification (manual, admin-granted)
  | 'verification.requested'
  | 'verification.approved'
  | 'verification.rejected';

interface AuditParams {
  userId: string;
  action: AuditAction;
  entityType:
    | 'project'
    | 'organization'
    | 'document'
    | 'invitation'
    | 'membership'
    | 'inquiry'
    | 'quotation';
  entityId: string;
  metadata?: Record<string, unknown>;
}

export async function writeAuditLog(params: AuditParams): Promise<void> {
  const supabase = await createClient();
  if (!supabase) return;

  await supabase.from('audit_log').insert({
    user_id: params.userId,
    action: params.action,
    entity_type: params.entityType,
    entity_id: params.entityId,
    metadata: params.metadata ?? {},
  });
  // Intentionally not throwing on audit failure — the main operation succeeds regardless.
}
