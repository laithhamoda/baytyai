import { describe, expect, it } from 'vitest';

import { explainRanking, rankConsultants, validateWeights } from './scoring';

import type { Criterion, Evaluation } from './types';

const criteria: Criterion[] = [
  {
    id: 'c1',
    key: 'experience',
    label: 'Relevant Experience',
    weight: 40,
    maxScore: 10,
    dimension: 'technical',
  },
  {
    id: 'c2',
    key: 'methodology',
    label: 'Methodology',
    weight: 30,
    maxScore: 10,
    dimension: 'technical',
  },
  {
    id: 'c3',
    key: 'price',
    label: 'Financial Proposal',
    weight: 30,
    maxScore: 10,
    dimension: 'financial',
  },
];

function evalFor(consultantId: string, raws: Record<string, number>): Evaluation {
  return {
    id: `e-${consultantId}`,
    processId: 'p1',
    consultantId,
    evaluatorId: 'u1',
    criteriaSetVersion: 1,
    submittedAt: '2026-06-30T00:00:00Z',
    scores: Object.entries(raws).map(([criterionId, raw]) => ({ criterionId, raw })),
  };
}

describe('validateWeights', () => {
  it('passes when weights sum to 100', () => {
    expect(validateWeights(criteria).ok).toBe(true);
  });
  it('fails when weights do not sum to 100', () => {
    expect(validateWeights([{ ...criteria[0], weight: 50 }, criteria[1], criteria[2]]).ok).toBe(
      false,
    );
  });
});

describe('rankConsultants', () => {
  it('ranks by weighted normalized total and assigns ranks', () => {
    const consultants = [
      { id: 'A', name: 'Alpha' },
      { id: 'B', name: 'Bravo' },
    ];
    const evaluations = [
      evalFor('A', { c1: 9, c2: 8, c3: 6 }), // tech strong, price mid
      evalFor('B', { c1: 6, c2: 6, c3: 10 }), // price strong, tech mid
    ];
    const ranked = rankConsultants(criteria, consultants, evaluations);
    // A: 0.9*40 + 0.8*30 + 0.6*30 = 36 + 24 + 18 = 78
    // B: 0.6*40 + 0.6*30 + 1.0*30 = 24 + 18 + 30 = 72
    expect(ranked[0].consultantId).toBe('A');
    expect(ranked[0].weightedTotal).toBe(78);
    expect(ranked[1].weightedTotal).toBe(72);
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });

  it('separates technical and financial totals', () => {
    const ranked = rankConsultants(
      criteria,
      [{ id: 'A', name: 'Alpha' }],
      [evalFor('A', { c1: 10, c2: 10, c3: 10 })],
    );
    expect(ranked[0].technicalTotal).toBe(70);
    expect(ranked[0].financialTotal).toBe(30);
  });
});

describe('explainRanking', () => {
  it('explains why the winner outranks the runner-up', () => {
    const ranked = rankConsultants(
      criteria,
      [
        { id: 'A', name: 'Alpha' },
        { id: 'B', name: 'Bravo' },
      ],
      [evalFor('A', { c1: 9, c2: 8, c3: 6 }), evalFor('B', { c1: 6, c2: 6, c3: 10 })],
    );
    const ex = explainRanking(ranked);
    expect(ex).not.toBeNull();
    expect(ex!.winnerId).toBe('A');
    expect(ex!.marginPoints).toBe(6);
    expect(ex!.reasons.length).toBeGreaterThan(0);
    // top reason should reference the highest-weight win (Relevant Experience)
    expect(ex!.reasons[0]).toContain('Relevant Experience');
  });
});
