import { NextResponse } from 'next/server';
import { z } from 'zod';

import { createClient } from '@/lib/supabase/server';

/**
 * POST /api/documents/[id]/status  — { status: 'draft' | 'final' | 'archived' }
 *
 * Transitions a generated document's status. RLS on generated_documents
 * (gendocs_update_own) ensures a user can only change their own documents.
 */

const bodySchema = z.object({ status: z.enum(['draft', 'final', 'archived']) });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  if (!supabase) return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('generated_documents')
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('id, status')
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Could not update document' }, { status: 500 });
  }
  return NextResponse.json({ id: data.id, status: data.status });
}
