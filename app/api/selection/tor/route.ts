import { NextResponse } from 'next/server';

import { generateTor, type TorInput } from '@/lib/consultant-selection/tor';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  let data: Partial<TorInput>;
  try {
    data = (await request.json()) as Partial<TorInput>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!data.projectTitle?.trim() || !data.scope?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'A project title and scope are required to draft a TOR.' },
      { status: 422 },
    );
  }

  const draft = await generateTor({
    projectTitle: data.projectTitle.trim(),
    scope: data.scope.trim(),
    complexity: data.complexity === 'mega' ? 'mega' : 'commercial',
    selectionMethod: data.selectionMethod,
    objectives: data.objectives,
    country: data.country,
  });

  return NextResponse.json({ ok: true, draft });
}
