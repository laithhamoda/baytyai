'use server';

import { ok, err } from '@/lib/actions/types';
import { listUserProjects } from '@/lib/db/projects';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';
import type { ProjectListRow } from '@/lib/db/projects';

export async function getProjects(): Promise<ActionResult<ProjectListRow[]>> {
  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return err('Unauthorized');

  try {
    const projects = await listUserProjects(user.id);
    return ok(projects);
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Failed to load projects');
  }
}
