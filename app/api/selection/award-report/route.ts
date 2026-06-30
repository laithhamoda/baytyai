import {
  renderAwardReportHtml,
  type AwardReportInput,
} from '@/lib/consultant-selection/award-report';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  let data: Partial<AwardReportInput>;
  try {
    data = (await request.json()) as Partial<AwardReportInput>;
  } catch {
    return new Response('Invalid request body.', { status: 400 });
  }

  if (!data.projectTitle?.trim() || !Array.isArray(data.ranked) || data.ranked.length === 0) {
    return new Response('A project title and at least one ranked consultant are required.', {
      status: 422,
    });
  }

  const html = renderAwardReportHtml({
    projectTitle: data.projectTitle.trim(),
    organizationName: data.organizationName,
    selectionMethod: data.selectionMethod,
    generatedAt: data.generatedAt ?? new Date().toISOString(),
    ranked: data.ranked,
    explanation: data.explanation ?? null,
    rationale: data.rationale,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': 'inline; filename="award-recommendation.html"',
    },
  });
}
