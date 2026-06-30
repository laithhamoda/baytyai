import type { Criterion, Evaluation, RankedConsultant, RankingExplanation } from './types';

/** Criteria weights must sum to exactly 100 before a set can be approved/locked. */
export function validateWeights(criteria: Criterion[]): { ok: boolean; sum: number } {
  const sum = criteria.reduce((a, c) => a + c.weight, 0);
  return { ok: Math.round(sum) === 100, sum };
}

/** Average raw scores across evaluators for one consultant+criterion. */
function averageRaw(evaluations: Evaluation[], consultantId: string, criterionId: string): number {
  const vals = evaluations
    .filter((e) => e.consultantId === consultantId && e.submittedAt)
    .map((e) => e.scores.find((s) => s.criterionId === criterionId)?.raw)
    .filter((v): v is number => typeof v === 'number');
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/**
 * Rank consultants by weighted, normalized score.
 *
 * For each criterion: normalized = avg(raw) / maxScore  (0..1)
 *   contribution = normalized * weight                  (0..weight points)
 * weightedTotal = sum(contribution)                     (0..100)
 *
 * Deterministic: ties break by technicalTotal, then name.
 */
export function rankConsultants(
  criteria: Criterion[],
  consultants: { id: string; name: string }[],
  evaluations: Evaluation[],
): RankedConsultant[] {
  const ranked: RankedConsultant[] = consultants.map((c) => {
    let weightedTotal = 0;
    let technicalTotal = 0;
    let financialTotal = 0;
    const perCriterion = criteria.map((cr) => {
      const avg = averageRaw(evaluations, c.id, cr.id);
      const normalized = cr.maxScore > 0 ? avg / cr.maxScore : 0;
      const contribution = normalized * cr.weight;
      weightedTotal += contribution;
      if (cr.dimension === 'technical') technicalTotal += contribution;
      else financialTotal += contribution;
      return {
        criterionId: cr.id,
        label: cr.label,
        weight: cr.weight,
        normalized,
        contribution,
      };
    });
    return {
      consultantId: c.id,
      name: c.name,
      weightedTotal: round2(weightedTotal),
      technicalTotal: round2(technicalTotal),
      financialTotal: round2(financialTotal),
      rank: 0,
      perCriterion,
    };
  });

  ranked.sort(
    (a, b) =>
      b.weightedTotal - a.weightedTotal ||
      b.technicalTotal - a.technicalTotal ||
      a.name.localeCompare(b.name),
  );
  ranked.forEach((r, i) => (r.rank = i + 1));
  return ranked;
}

/**
 * Explain, in plain language, why the top consultant outranks the runner-up.
 * Surfaces the criteria where the winner gained the most points — the
 * transparency layer the UX requires.
 */
export function explainRanking(ranked: RankedConsultant[]): RankingExplanation | null {
  if (ranked.length < 2) return null;
  const [winner, runnerUp] = ranked;

  const deltas = winner.perCriterion
    .map((wc) => {
      const rc = runnerUp.perCriterion.find((x) => x.criterionId === wc.criterionId);
      return {
        label: wc.label,
        weight: wc.weight,
        delta: round2(wc.contribution - (rc?.contribution ?? 0)),
      };
    })
    .filter((d) => Math.abs(d.delta) > 0.01)
    .sort((a, b) => b.delta - a.delta);

  const gains = deltas.filter((d) => d.delta > 0).slice(0, 3);
  const losses = deltas.filter((d) => d.delta < 0).slice(0, 2);

  const reasons: string[] = [];
  for (const g of gains) {
    reasons.push(
      `Scored higher on "${g.label}" (weight ${g.weight}%), contributing +${g.delta} more points.`,
    );
  }
  for (const l of losses) {
    reasons.push(
      `Scored lower on "${l.label}" (weight ${l.weight}%), giving back ${Math.abs(l.delta)} points — but not enough to change the outcome.`,
    );
  }
  if (gains.length === 0) {
    reasons.push(
      'The two are very close; the lead comes from small advantages spread across criteria.',
    );
  }

  return {
    winnerId: winner.consultantId,
    runnerUpId: runnerUp.consultantId,
    marginPoints: round2(winner.weightedTotal - runnerUp.weightedTotal),
    reasons,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
