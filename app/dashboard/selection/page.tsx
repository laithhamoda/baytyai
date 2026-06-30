import EvaluationStudio from './evaluation-studio';
import TorStudio from './tor-studio';

export const metadata = {
  title: { absolute: 'Consultant Selection — BaytyAI' },
};

const STAGES: { key: string; label: string; tip: string; done?: boolean }[] = [
  {
    key: 'intake',
    label: 'Project intake',
    tip: 'Capture project details and complexity (commercial or mega).',
  },
  {
    key: 'method',
    label: 'Selection method',
    tip: 'System recommends QBS, QCBS, LCS, FBS or single-source based on the project.',
  },
  {
    key: 'tor',
    label: 'Terms of Reference',
    tip: 'AI-assisted TOR draft; version-controlled and approved before release.',
  },
  {
    key: 'prequalification',
    label: 'Prequalification',
    tip: 'Collect and screen consultant prequalification responses.',
  },
  {
    key: 'shortlist',
    label: 'Shortlist',
    tip: 'Promote prequalified consultants to the evaluation shortlist.',
  },
  {
    key: 'technical_eval',
    label: 'Technical evaluation',
    tip: 'Weighted technical scoring against the locked criteria set.',
    done: true,
  },
  {
    key: 'financial_eval',
    label: 'Financial evaluation',
    tip: 'Score financial proposals on the financial criteria.',
    done: true,
  },
  {
    key: 'clarifications',
    label: 'Clarifications',
    tip: 'Structured clarification log — every question and answer recorded.',
  },
  { key: 'interviews', label: 'Interviews', tip: 'Structured interview log with panel and notes.' },
  {
    key: 'award',
    label: 'Award recommendation',
    tip: 'Generate an exportable award recommendation report with the ranking snapshot.',
  },
  {
    key: 'performance',
    label: 'Performance tracking',
    tip: 'Track post-award consultant performance.',
  },
];

export default function SelectionPage() {
  return (
    <div className="mx-auto max-w-5xl p-2">
      <header className="mb-10">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">
          Consultant Selection
        </p>
        <h1 className="font-sans text-3xl font-semibold text-steel-900">
          Guided consultant selection &amp; evaluation
        </h1>
        <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-steel-600">
          A transparent, auditable workflow from project intake to award recommendation. Criteria
          and weights are version-controlled and locked before scoring — and the system always
          explains why one consultant ranks higher.
        </p>
      </header>

      {/* Stage rail */}
      <ol className="mb-12 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STAGES.map((s, i) => (
          <li
            key={s.key}
            title={s.tip}
            className={`flex items-start gap-3 border p-4 ${
              s.done ? 'border-bayty-500/40 bg-steel-50' : 'border-steel-200 bg-white'
            }`}
          >
            <span className={`font-mono text-xs ${s.done ? 'text-bayty-600' : 'text-steel-500'}`}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <div>
              <p className="font-sans text-sm font-medium text-steel-900">{s.label}</p>
              <p className="mt-1 font-sans text-xs leading-relaxed text-steel-500">{s.tip}</p>
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby="tor-heading" className="mb-14">
        <h2 id="tor-heading" className="mb-2 font-sans text-xl font-semibold text-steel-900">
          Terms of Reference (AI-assisted)
        </h2>
        <p className="mb-6 font-sans text-sm text-steel-600">
          Provide the project details and draft a structured TOR. When an Anthropic API key is
          configured the draft is tailored by Claude; otherwise a professional template is used — no
          paid service required. Every draft is reviewed and approved before it is version-locked.
        </p>
        <TorStudio />
      </section>

      <section aria-labelledby="eval-heading">
        <h2 id="eval-heading" className="mb-2 font-sans text-xl font-semibold text-steel-900">
          Technical &amp; financial evaluation
        </h2>
        <p className="mb-6 font-sans text-sm text-steel-600">
          Adjust weights (must total 100% before locking), score each consultant 0–10 per criterion,
          and the weighted ranking and explanation update live. No hidden logic — every number is
          shown.
        </p>
        <EvaluationStudio />
      </section>
    </div>
  );
}
