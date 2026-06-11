'use server';

import { createClient } from '@/lib/supabase/server';
import { getDraftById } from '@/lib/db/projects';
import { writeAuditLog } from '@/lib/db/audit';
import { projectSubmitRatelimit } from '@/lib/rate-limit';
import { ok, err } from '@/lib/actions/types';
import type { ActionResult } from '@/lib/actions/types';
import { masterProjectSchema } from '@/lib/validations/project/master-schema';

export async function submitProject(
  projectId: string,
): Promise<ActionResult<{ referenceNumber: string }>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  const { success: rateLimitOk } = await projectSubmitRatelimit.limit(user.id);
  if (!rateLimitOk) {
    return err('Submission limit reached (5 per hour). Please try again later.');
  }

  const draft = await getDraftById(projectId, user.id);
  if (!draft) return err('Project not found');
  if (draft.status !== 'draft') return err('Project already submitted');

  const parsed = masterProjectSchema.safeParse({
    step1: draft.org_data,
    step2: draft.project_data,
    step3: draft.scope_data,
    step4: draft.docs_data,
    step5: {
      confirm_data_accuracy: true,
      confirm_authority_to_submit: true,
      consent_data_processing: true,
      consent_pdpl: true,
    },
  });

  if (!parsed.success) {
    return err('Please complete all required fields before submitting.');
  }

  // Single UPDATE with optimistic lock prevents double-submit
  const { data: updatedProject, error: updateError } = await supabase
    .from('projects')
    .update({ status: 'submitted' })
    .eq('id', projectId)
    .eq('user_id', user.id)
    .eq('status', 'draft')
    .select('reference_number')
    .maybeSingle();

  if (updateError || !updatedProject) {
    return err('Submission failed. The project may have already been submitted.');
  }

  const referenceNumber = (updatedProject as { reference_number: string }).reference_number;

  await Promise.all([
    writeAuditLog({
      userId: user.id,
      action: 'project.submitted',
      entityType: 'project',
      entityId: projectId,
      metadata: { referenceNumber },
    }),
    supabase.from('project_submissions').insert({
      project_id: projectId,
      user_id: user.id,
      submitted_at: new Date().toISOString(),
    }),
  ]);

  return ok({ referenceNumber });
}
