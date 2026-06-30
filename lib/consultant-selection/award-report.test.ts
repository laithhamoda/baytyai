import { describe, expect, it } from 'vitest';

import { renderAwardReportHtml } from './award-report';

import type { RankedConsultant } from './types';

const ranked: RankedConsultant[] = [
  {
    consultantId: 'A',
    name: 'Meridian Consult',
    weightedTotal: 78,
    technicalTotal: 60,
    financialTotal: 18,
    rank: 1,
    perCriterion: [
      { criterionId: 'c1', label: 'Experience', weight: 40, normalized: 0.9, contribution: 36 },
    ],
  },
  {
    consultantId: 'B',
    name: 'Atlas Engineering',
    weightedTotal: 72,
    technicalTotal: 42,
    financialTotal: 30,
    rank: 2,
    perCriterion: [
      { criterionId: 'c1', label: 'Experience', weight: 40, normalized: 0.6, contribution: 24 },
    ],
  },
];

describe('renderAwardReportHtml', () => {
  it('produces an HTML doc naming the recommended consultant', () => {
    const html = renderAwardReportHtml({
      projectTitle: 'Riverside Tower',
      generatedAt: '2026-06-30T00:00:00Z',
      ranked,
      explanation: {
        winnerId: 'A',
        runnerUpId: 'B',
        marginPoints: 6,
        reasons: ['Scored higher on "Experience".'],
      },
    });
    expect(html).toContain('<!doctype html>');
    expect(html).toContain('Riverside Tower');
    expect(html).toContain('Meridian Consult');
    expect(html).toContain('Recommended for award');
    expect(html).toContain('2026-06-30');
  });

  it('escapes user-controlled content', () => {
    const html = renderAwardReportHtml({
      projectTitle: '<script>alert(1)</script>',
      generatedAt: '2026-06-30T00:00:00Z',
      ranked,
      explanation: null,
    });
    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});
