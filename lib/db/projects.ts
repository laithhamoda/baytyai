import { createClient } from '@/lib/supabase/server';

export type ProjectDraftRow = {
  id: string;
  reference_number: string | null;
  status: string;
  org_data: Record<string, unknown> | null;
  project_data: Record<string, unknown> | null;
  scope_data: Record<string, unknown> | null;
  docs_data: Record<string, unknown> | null;
  current_step: number;
  created_at: string;
  updated_at: string;
};

export async function getOrCreateDraft(userId: string): Promise<ProjectDraftRow> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');

  const { data: existing } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'draft')
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing) return existing as ProjectDraftRow;

  const { data: created, error } = await supabase
    .from('projects')
    .insert({ user_id: userId, status: 'draft', current_step: 1 })
    .select()
    .single();

  if (error || !created) {
    throw new Error(error?.message ?? 'Failed to create project draft');
  }

  return created as ProjectDraftRow;
}

export async function getDraftById(
  projectId: string,
  userId: string,
): Promise<ProjectDraftRow | null> {
  const supabase = await createClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .eq('user_id', userId)
    .maybeSingle();

  return (data as ProjectDraftRow) ?? null;
}

export async function updateProjectStep(
  projectId: string,
  userId: string,
  step: number,
  columnName: string,
  payload: Record<string, unknown>,
): Promise<void> {
  const supabase = await createClient();
  if (!supabase) throw new Error('Database unavailable');

  const { error } = await supabase
    .from('projects')
    .update({
      [columnName]: payload,
      current_step: step,
    })
    .eq('id', projectId)
    .eq('user_id', userId);

  if (error) throw new Error(error.message);
}

export type ProjectListRow = {
  id: string;
  reference_number: string | null;
  status: string;
  current_step: number;
  project_name_en: string | null;
  created_at: string;
  updated_at: string;
};

export async function listUserProjects(userId: string): Promise<ProjectListRow[]> {
  const supabase = await createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('id, reference_number, status, current_step, project_data, created_at, updated_at')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    reference_number: row.reference_number as string | null,
    status: row.status as string,
    current_step: row.current_step as number,
    project_name_en:
      (row.project_data as Record<string, unknown> | null)?.name_en as string | null ?? null,
    created_at: row.created_at as string,
    updated_at: row.updated_at as string,
  }));
}
