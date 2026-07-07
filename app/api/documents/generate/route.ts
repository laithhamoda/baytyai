import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  DOC_TYPES,
  generateDocument,
  type DocContext,
  type DocType,
} from '@/lib/documents/generate';
import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/documents/generate
 *
 * Drafts a FIDIC-style document (RFI, Engineer's Instruction, Material Submittal)
 * with the AI engine and persists it as a 'draft' generated_documents row owned
 * by the authenticated user. AI is the first drafter — the row is editable and
 * must be finalised by a human.
 *
 * Additive: writes to the new generated_documents table (migration 012); does
 * not touch the existing project/document schema.
 */

const bodySchema = z.object({
  projectId: z.string().uuid(),
  docType: z.enum(DOC_TYPES as [DocType, ...DocType[]]),
  language: z.enum(['en', 'ar']).default('en'),
  packageRef: z.string().max(120).optional(),
  inputs: z.record(z.string(), z.string().max(4000)).default({}),
});

const REF_PREFIX: Record<DocType, string> = {
  rfi: 'RFI',
  engineers_instruction: 'EI',
  material_submittal: 'MS',
  local_purchase_order: 'LPO',
  interim_payment_application: 'IPA',
  variation_order_request: 'VOR',
};

function refNo(docType: DocType): string {
  const prefix = REF_PREFIX[docType];
  // Short, human-readable, collision-resistant enough for a reference tag.
  const rand = Math.abs(Date.now() ^ (Math.random() * 1e9))
    .toString(36)
    .toUpperCase()
    .slice(-6);
  return `${prefix}-${rand}`;
}

/** Best-effort read of the wizard project_data JSONB, which is loosely shaped. */
function readContext(
  project: { project_data: unknown; org_data: unknown },
  language: 'en' | 'ar',
  packageRef: string | undefined,
  inputs: Record<string, string>,
): DocContext {
  const pd = (project.project_data ?? {}) as Record<string, unknown>;
  const od = (project.org_data ?? {}) as Record<string, unknown>;
  const str = (v: unknown, fallback: string) => (typeof v === 'string' && v ? v : fallback);
  return {
    project: {
      name: str(pd.name ?? pd.projectName ?? pd.title, 'Project'),
      location: str(pd.location ?? pd.city ?? pd.emirate, 'UAE'),
    },
    parties: {
      employer:
        str(od.name ?? od.companyName ?? od.legalName, undefined as unknown as string) || undefined,
    },
    packageRef,
    language,
    inputs,
  };
}

export async function POST(request: Request) {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let input: z.infer<typeof bodySchema>;
  try {
    input = bodySchema.parse(await request.json());
  } catch (err) {
    return NextResponse.json(
      { error: 'Invalid request', details: err instanceof z.ZodError ? err.issues : undefined },
      { status: 400 },
    );
  }

  // RLS on `projects` ensures the user can only read a project they own.
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('id, project_data, org_data')
    .eq('id', input.projectId)
    .single();
  if (projErr || !project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  const ctx = readContext(project, input.language, input.packageRef, input.inputs);
  const draft = await generateDocument(input.docType, ctx);
  const reference_no = refNo(input.docType);

  const { data: inserted, error: insErr } = await supabase
    .from('generated_documents')
    .insert({
      project_id: input.projectId,
      user_id: user.id,
      doc_type: input.docType,
      reference_no,
      title: draft.title,
      language: input.language,
      status: 'draft',
      fidic_clause: draft.fidicClause ?? null,
      body: { sections: draft.sections, meta: { packageRef: input.packageRef ?? null } },
      ai_generated: draft.source === 'ai',
      source: draft.source,
    })
    .select('id')
    .single();

  if (insErr || !inserted) {
    return NextResponse.json({ error: 'Could not save document' }, { status: 500 });
  }

  return NextResponse.json({
    documentId: inserted.id,
    referenceNo: reference_no,
    title: draft.title,
    fidicClause: draft.fidicClause ?? null,
    source: draft.source, // 'ai' when the key is set, else 'template'
    sections: draft.sections,
  });
}
