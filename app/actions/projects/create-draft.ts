'use server';

import { createClient } from '@/lib/supabase/server';
import { getOrCreateDraft } from '@/lib/db/projects';
import { writeAuditLog } from '@/lib/db/audit';
import { ok, err } from '@/lib/actions/types';
import type { ActionResult } from '@/lib/actions/types';

export async function createDraft(): Promise<ActionResult<{ projectId: string }>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  try {
    const draft = await getOrCreateDraft(user.id);

    if (draft.status === 'draft' && !draft.org_data) {
      await writeAuditLog({
        userId: user.id,
        action: 'project.draft_created',
        entityType: 'project',
        entityId: draft.id,
      });
    }

    return ok({ projectId: draft.id });
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Failed to create draft');
  }
}
