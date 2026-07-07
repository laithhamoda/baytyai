import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

/**
 * PATCH /api/documents/[id] — edit a draft's title and/or section bodies.
 *
 * The AI is the first drafter; this is how a human corrects the draft before
 * finalising. RLS (gendocs_update_own) ensures owner-only writes. Final and
 * archived documents are locked (server-side check below).
 */

const bodySchema = z.object({
  title: z.string().min(1).max(300).optional(),
  sections: z
    .array(z.object({ heading: z.string().max(200), body: z.string().max(20000) }))
    .max(30)
    .optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let patch: z.infer<typeof bodySchema>;
  try {
    patch = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Read current row (RLS scopes to owner) to enforce the draft-only lock and to
  // merge the section edit into the existing body payload.
  const { data: current, error: readErr } = await supabase
    .from('generated_documents')
    .select('status, body')
    .eq('id', id)
    .single();
  if (readErr || !current) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (current.status !== 'draft') {
    return NextResponse.json({ error: 'Only drafts can be edited' }, { status: 409 });
  }

  const currentBody = (current.body ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.title) update.title = patch.title;
  if (patch.sections) update.body = { ...currentBody, sections: patch.sections };

  const { data, error } = await supabase
    .from('generated_documents')
    .update(update)
    .eq('id', id)
    .select('id, title, body')
    .single();

  if (error || !data) return NextResponse.json({ error: 'Could not save' }, { status: 500 });
  return NextResponse.json({ id: data.id, title: data.title, body: data.body });
}
