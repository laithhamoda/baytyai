'use client';

import { useMemo, useState } from 'react';

import { saveAwardRecommendation } from '@/app/actions/selection/award';
import { saveEvaluation } from '@/app/actions/selection/manage';
import {
  explainRanking,
  rankConsultants,
  validateWeights,
} from '@/lib/consultant-selection/scoring';

import type { Criterion, Evaluation } from '@/lib/consultant-selection/types';

/**
 * When `process` is supplied the studio is wired to a real DB-backed process:
 * criteria, consultants and scores come from Supabase and the "Save scores"
 * button persists each consultant's scores via the saveEvaluation server action.
 * Without it, the studio runs in interactive demo mode (no persistence).
 */
export interface StudioProcess {
  processId: string;
  criteriaSetVersion: number;
  criteriaLocked: boolean;
  criteria: Criterion[];
  consultants: { id: string; name: string }[];
  scores: ScoreMap;
}

// Seed criteria (editable weights) — a real process loads these from the locked
// criteria set. maxScore fixed at 10 for the demo.
const SEED: Criterion[] = [
  {
    id: 'c1',
    key: 'experience',
    label: 'Relevant Experience',
    weight: 35,
    maxScore: 10,
    dimension: 'technical',
  },
  {
    id: 'c2',
    key: 'methodology',
    label: 'Methodology & Approach',
    weight: 25,
    maxScore: 10,
    dimension: 'technical',
  },
  {
    id: 'c3',
    key: 'team',
    label: 'Key Personnel',
    weight: 15,
    maxScore: 10,
    dimension: 'technical',
  },
  {
    id: 'c4',
    key: 'price',
    label: 'Financial Proposal',
    weight: 25,
    maxScore: 10,
    dimension: 'financial',
  },
];

const CONSULTANTS = [
  { id: 'A', name: 'Meridian Consult' },
  { id: 'B', name: 'Atlas Engineering' },
  { id: 'C', name: 'Vertex Advisory' },
];

type ScoreMap = Record<string, Record<string, number>>; // consultantId -> criterionId -> raw

const initialScores: ScoreMap = {
  A: { c1: 9, c2: 8, c3: 8, c4: 6 },
  B: { c1: 7, c2: 7, c3: 6, c4: 9 },
  C: { c1: 6, c2: 9, c3: 7, c4: 8 },
};

export default function EvaluationStudio({ process }: { process?: StudioProcess }) {
  const seedCriteria = process?.criteria.length ? process.criteria : SEED;
  const seedConsultants = process?.consultants.length ? process.consultants : CONSULTANTS;
  const seedScores = process?.scores ?? initialScores;

  const [criteria, setCriteria] = useState(seedCriteria);
  const [scores, setScores] = useState<ScoreMap>(seedScores);
  const [locked, setLocked] = useState(process?.criteriaLocked ?? false);
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [awardState, setAwardState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const consultants = seedConsultants;

  async function saveScores() {
    if (!process) return;
    setSaveState('saving');
    try {
      for (const c of process.consultants) {
        const result = await saveEvaluation({
          processId: process.processId,
          consultantId: c.id,
          criteriaSetVersion: process.criteriaSetVersion,
          scores: criteria.map((cr) => ({ criterionId: cr.id, raw: scores[c.id]?.[cr.id] ?? 0 })),
          submit: true,
        });
        if (!result.success) {
          setSaveState('error');
          return;
        }
      }
      setSaveState('saved');
    } catch {
      setSaveState('error');
    }
  }

  const weights = validateWeights(criteria);

  const ranked = useMemo(() => {
    const evaluations: Evaluation[] = consultants.map((c) => ({
      id: `e-${c.id}`,
      processId: process?.processId ?? 'demo',
      consultantId: c.id,
      evaluatorId: 'demo',
      criteriaSetVersion: process?.criteriaSetVersion ?? 1,
      submittedAt: '2026-01-01T00:00:00Z',
      scores: criteria.map((cr) => ({ criterionId: cr.id, raw: scores[c.id]?.[cr.id] ?? 0 })),
    }));
    return rankConsultants(criteria, consultants, evaluations);
  }, [criteria, scores, consultants, process]);

  const explanation = useMemo(() => explainRanking(ranked), [ranked]);
  const winnerName = ranked[0]?.name;
  const runnerName = ranked.find((r) => r.consultantId === explanation?.runnerUpId)?.name;

  async function saveAward() {
    if (!process) return;
    const winner = ranked[0];
    if (!winner) return;
    setAwardState('saving');
    try {
      const rationale = explanation
        ? `${winner.name} leads by ${explanation.marginPoints} weighted points. ${explanation.reasons.join(' ')}`
        : `${winner.name} is the highest-ranked consultant with ${winner.weightedTotal} weighted points.`;
      const result = await saveAwardRecommendation({
        processId: process.processId,
        recommendedConsultantId: winner.consultantId,
        rationale,
        rankingSnapshot: ranked,
      });
      setAwardState(result.success ? 'saved' : 'error');
    } catch {
      setAwardState('error');
    }
  }

  const [exporting, setExporting] = useState(false);

  async function exportAwardReport() {
    setExporting(true);
    try {
      const res = await fetch('/api/selection/award-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle: 'Consultant Selection',
          selectionMethod: 'QCBS',
          generatedAt: new Date().toISOString(),
          ranked,
          explanation,
        }),
      });
      if (!res.ok) return;
      const html = await res.text();
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener,noreferrer');
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } finally {
      setExporting(false);
    }
  }

  function setWeight(id: string, w: number) {
    if (locked) return;
    setCriteria((cs) => cs.map((c) => (c.id === id ? { ...c, weight: w } : c)));
  }
  function setScore(cid: string, crid: string, v: number) {
    setScores((s) => ({ ...s, [cid]: { ...s[cid], [crid]: Math.max(0, Math.min(10, v)) } }));
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Criteria weights */}
      <div className="border border-ink-700 bg-ink-900 p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-sans text-sm font-semibold text-ink-100">
            Evaluation criteria &amp; weights
          </h3>
          <button
            type="button"
            onClick={() => setLocked((l) => !l)}
            className={`font-mono text-[11px] uppercase tracking-widest ${locked ? 'text-alert-500' : 'text-signal-500'}`}
            title="Once locked, weights cannot change unless a new approved version is created."
          >
            {locked ? '● Locked' : '○ Lock & approve'}
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {criteria.map((c) => (
            <div key={c.id} className="flex items-center gap-4">
              <span className="w-56 font-sans text-sm text-ink-300">{c.label}</span>
              <span className="font-mono text-[10px] uppercase text-ink-500">{c.dimension}</span>
              <input
                type="number"
                value={c.weight}
                min={0}
                max={100}
                disabled={locked}
                onChange={(e) => setWeight(c.id, Number(e.target.value))}
                className="w-20 border border-ink-700 bg-ink-950 px-2 py-1 text-right font-mono text-sm text-ink-100 disabled:opacity-60"
              />
              <span className="font-mono text-xs text-ink-500">%</span>
            </div>
          ))}
        </div>
        <p
          className={`mt-3 font-mono text-[11px] ${weights.ok ? 'text-success-500' : 'text-alert-500'}`}
        >
          Weights total {weights.sum}%
          {weights.ok ? ' — valid.' : ' — must equal 100% before locking.'}
        </p>
      </div>

      {/* Comparison table */}
      <div className="overflow-x-auto border border-ink-700">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-ink-900">
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Consultant
              </th>
              {criteria.map((c) => (
                <th
                  key={c.id}
                  className="p-3 font-mono text-[10px] uppercase tracking-widest text-ink-500"
                >
                  {c.label} ({c.weight}%)
                </th>
              ))}
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-signal-500">
                Weighted
              </th>
              <th className="p-3 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Rank
              </th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((r) => (
              <tr key={r.consultantId} className="border-t border-ink-700">
                <td className="p-3 font-sans text-sm font-medium text-ink-100">{r.name}</td>
                {criteria.map((c) => (
                  <td key={c.id} className="p-3">
                    <input
                      type="number"
                      min={0}
                      max={10}
                      value={scores[r.consultantId]?.[c.id] ?? 0}
                      onChange={(e) => setScore(r.consultantId, c.id, Number(e.target.value))}
                      className="w-16 border border-ink-700 bg-ink-950 px-2 py-1 text-right font-mono text-sm text-ink-100"
                    />
                  </td>
                ))}
                <td className="p-3 font-mono text-sm font-medium text-signal-500">
                  {r.weightedTotal}
                </td>
                <td className="p-3 font-mono text-sm text-ink-100">#{r.rank}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Explanation layer */}
      {explanation && (
        <div className="border-l-2 border-signal-500 bg-ink-900 p-6">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-signal-500">
            Why {winnerName} ranks #1
          </p>
          <p className="mb-3 font-sans text-sm text-ink-100">
            {winnerName} leads {runnerName} by {explanation.marginPoints} weighted points.
          </p>
          <ul className="flex flex-col gap-2">
            {explanation.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2">
                <span aria-hidden="true" className="mt-1.5 size-1.5 shrink-0 bg-signal-500" />
                <span className="font-sans text-sm text-ink-300">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Persistence (real process only) */}
      {process && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={saveScores}
            disabled={saveState === 'saving'}
            className="bg-signal-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-950 disabled:opacity-40"
          >
            {saveState === 'saving' ? 'Saving…' : 'Save scores'}
          </button>
          <span className="font-sans text-xs text-ink-500">
            {saveState === 'saved' && (
              <span className="text-success-500">Scores saved to this process.</span>
            )}
            {saveState === 'error' && (
              <span className="text-alert-500">
                Could not save — check your access and try again.
              </span>
            )}
            {saveState === 'idle' &&
              'Persists each consultant’s scores to the selection process (criteria set v' +
                process.criteriaSetVersion +
                ').'}
          </span>
        </div>
      )}

      {/* Award recommendation (real process only) */}
      {process && (
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={saveAward}
            disabled={awardState === 'saving' || ranked.length === 0}
            className="border border-success-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-success-500 disabled:opacity-40"
          >
            {awardState === 'saving' ? 'Recording…' : 'Record award recommendation'}
          </button>
          <span className="font-sans text-xs text-ink-500">
            {awardState === 'saved' && (
              <span className="text-success-500">
                Award recommendation saved with the current ranking snapshot.
              </span>
            )}
            {awardState === 'error' && (
              <span className="text-alert-500">Could not record the award recommendation.</span>
            )}
            {awardState === 'idle' &&
              `Records ${winnerName ?? 'the top consultant'} as the recommended award with a frozen ranking snapshot.`}
          </span>
        </div>
      )}

      {/* Export */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={exportAwardReport}
          disabled={exporting || ranked.length === 0}
          className="border border-signal-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-signal-500 disabled:opacity-40"
          title="Opens a print-ready award recommendation; use your browser's Save as PDF."
        >
          {exporting ? 'Preparing…' : 'Export award report (PDF)'}
        </button>
        <span className="font-sans text-xs text-ink-500">
          Generates a printable award recommendation with the current ranking snapshot and
          explanation.
        </span>
      </div>
    </div>
  );
}
