'use server';

import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { getDraftById, updateProjectStep } from '@/lib/db/projects';
import { writeAuditLog } from '@/lib/db/audit';
import { draftSaveRatelimit } from '@/lib/rate-limit';
import { ok, err } from '@/lib/actions/types';
import type { ActionResult } from '@/lib/actions/types';
import { step1Schema } from '@/lib/validations/project/step-1-schema';
import { step2Schema } from '@/lib/validations/project/step-2-schema';
import { step3Schema } from '@/lib/validations/project/step-3-schema';
import { step4Schema } from '@/lib/validations/project/step-4-schema';

const STEP_MAP: Record<number, { schema: z.ZodTypeAny; column: string }> = {
  1: { schema: step1Schema, column: 'org_data' },
  2: { schema: step2Schema, column: 'project_data' },
  3: { schema: step3Schema, column: 'scope_data' },
  4: { schema: step4Schema, column: 'docs_data' },
};

export async function saveStep(
  projectId: string,
  step: number,
  formData: unknown,
): Promise<ActionResult<undefined>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  const { success: rateLimitOk } = await draftSaveRatelimit.limit(user.id);
  if (!rateLimitOk) return err('Too many requests. Please slow down.');

  const stepConfig = STEP_MAP[step];
  if (!stepConfig) return err('Invalid step');

  const draft = await getDraftById(projectId, user.id);
  if (!draft) return err('Project not found');
  if (draft.status !== 'draft') return err('Cannot edit a submitted project');

  const parsed = stepConfig.schema.safeParse(formData);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of (parsed.error as z.ZodError).issues) {
      const key = issue.path.join('.');
      fieldErrors[key] = [...(fieldErrors[key] ?? []), issue.message];
    }
    return err('Validation failed', fieldErrors);
  }

  try {
    await updateProjectStep(
      projectId,
      user.id,
      step,
      stepConfig.column,
      parsed.data as Record<string, unknown>,
    );

    await writeAuditLog({
      userId: user.id,
      action: 'project.step_saved',
      entityType: 'project',
      entityId: projectId,
      metadata: { step },
    });

    return ok(undefined);
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Failed to save');
  }
}
