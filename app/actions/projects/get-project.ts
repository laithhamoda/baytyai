'use server';

import { ok, err } from '@/lib/actions/types';
import { getDraftById } from '@/lib/db/projects';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';
import type { ProjectDraftRow } from '@/lib/db/projects';

export async function getProject(projectId: string): Promise<ActionResult<ProjectDraftRow>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  try {
    const project = await getDraftById(projectId, user.id);
    if (!project) return err('Project not found');
    return ok(project);
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Failed to load project');
  }
}
