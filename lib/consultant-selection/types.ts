/**
 * Reusable, API-ready data models for the Construction Consultant Selection module.
 *
 * Workflow stages (a guided wizard drives these in order):
 *   1. intake            — project details + complexity
 *   2. method            — recommended selection method (QBS/QCBS/LCS/...)
 *   3. tor               — Terms of Reference (AI-assisted draft + versioned)
 *   4. prequalification  — consultant prequalification responses
 *   5. shortlist         — shortlist creation from prequalified consultants
 *   6. technical_eval     — weighted technical scoring
 *   7. financial_eval     — financial scoring
 *   8. clarifications     — structured clarification log
 *   9. interviews         — structured interview log
 *  10. award              — award recommendation + report
 *  11. performance        — post-award performance tracking
 */

export type ProjectComplexity = 'commercial' | 'mega';

export type SelectionMethod =
  | 'QBS' // Quality-Based Selection
  | 'QCBS' // Quality- and Cost-Based Selection
  | 'LCS' // Least-Cost Selection
  | 'FBS' // Fixed-Budget Selection
  | 'SSS'; // Single-Source Selection

export type SelectionStage =
  | 'intake'
  | 'method'
  | 'tor'
  | 'prequalification'
  | 'shortlist'
  | 'technical_eval'
  | 'financial_eval'
  | 'clarifications'
  | 'interviews'
  | 'award'
  | 'performance';

export const SELECTION_STAGES: SelectionStage[] = [
  'intake',
  'method',
  'tor',
  'prequalification',
  'shortlist',
  'technical_eval',
  'financial_eval',
  'clarifications',
  'interviews',
  'award',
  'performance',
];

/** A criteria set is versioned and locked once a process moves to scoring. */
export interface CriteriaSet {
  id: string;
  processId: string;
  version: number;
  status: 'draft' | 'approved' | 'locked';
  /** must sum to 100 across criteria */
  criteria: Criterion[];
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
}

export interface Criterion {
  id: string;
  key: string;
  label: string;
  /** 0–100; the set must sum to 100 */
  weight: number;
  /** the max raw score an evaluator may give for this criterion */
  maxScore: number;
  /** technical or financial dimension */
  dimension: 'technical' | 'financial';
  guidance?: string;
}

export interface Consultant {
  id: string;
  processId: string;
  name: string;
  prequalified: boolean;
  shortlisted: boolean;
}

/** One evaluator's raw scores for one consultant against a criteria version. */
export interface Evaluation {
  id: string;
  processId: string;
  consultantId: string;
  evaluatorId: string;
  criteriaSetVersion: number;
  scores: ScoreEntry[];
  submittedAt?: string;
}

export interface ScoreEntry {
  criterionId: string;
  /** raw score, 0..criterion.maxScore */
  raw: number;
  note?: string;
}

export interface RankedConsultant {
  consultantId: string;
  name: string;
  /** 0–100 normalized weighted total */
  weightedTotal: number;
  technicalTotal: number;
  financialTotal: number;
  rank: number;
  perCriterion: {
    criterionId: string;
    label: string;
    weight: number;
    normalized: number; // 0–1 of this criterion
    contribution: number; // points contributed to weightedTotal
  }[];
}

/** Plain-language explanation of why one consultant outranks another. */
export interface RankingExplanation {
  winnerId: string;
  runnerUpId: string;
  marginPoints: number;
  reasons: string[];
}
