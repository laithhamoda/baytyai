import { NextResponse } from 'next/server';

import { summarizeProposal, type ProposalSummaryInput } from '@/lib/consultant-selection/tor';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: Request) {
  let data: Partial<ProposalSummaryInput>;
  try {
    data = (await request.json()) as Partial<ProposalSummaryInput>;
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  if (!data.consultantName?.trim() || !data.proposalText?.trim()) {
    return NextResponse.json(
      { ok: false, error: 'A consultant name and proposal text are required.' },
      { status: 422 },
    );
  }

  const summary = await summarizeProposal({
    consultantName: data.consultantName.trim(),
    proposalText: data.proposalText.trim(),
  });

  return NextResponse.json({ ok: true, summary });
}
