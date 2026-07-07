import { getProjects } from '@/app/actions/projects/get-projects';
import { createClient } from '@/lib/supabase/server';

import DocumentsClient, { type GeneratedDocRow, type ProjectOption } from './documents-client';

export const metadata = { title: 'AI Documents' };

export default async function DocumentsPage() {
  const result = await getProjects();
  const projects: ProjectOption[] = (result.success ? result.data : []).map((p) => ({
    id: p.id,
    label: p.project_name_en || p.reference_number || 'Untitled project',
  }));

  // Load existing generated documents. If migration 012 has not been applied to
  // the live DB yet, the table is absent — degrade to an empty list + a notice
  // rather than crashing the page.
  let docs: GeneratedDocRow[] = [];
  let tableReady = true;
  const supabase = await createClient();
  if (supabase) {
    const { data, error } = await supabase
      .from('generated_documents')
      .select(
        'id, doc_type, reference_no, title, status, source, language, fidic_clause, body, created_at',
      )
      .order('created_at', { ascending: false })
      .limit(50);
    if (error) {
      tableReady = false;
    } else {
      docs = (data ?? []) as GeneratedDocRow[];
    }
  }

  return <DocumentsClient projects={projects} initialDocs={docs} tableReady={tableReady} />;
}
