'use client';

import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import Counter from '@/components/motion/Counter';
import Reveal from '@/components/motion/Reveal';

type Stakeholder = {
  role: string;
  headline: string;
  pain: string;
  gains: string[];
  metric: { to: number; decimals?: number; prefix?: string; suffix?: string; label: string };
};

const STAKEHOLDERS: Stakeholder[] = [
  {
    role: 'Client / Owner',
    headline: 'Protect your margin and your reputation on every contract.',
    pain: 'Scope creep, untraceable approvals, and reactive maintenance quietly erode 2–4% of contract value before the first dispute is even filed.',
    gains: [
      'Total cost and risk visibility across the portfolio',
      'Defensible, timestamped decisions — board-ready',
      'Fewer disputes and faster, on-time delivery',
    ],
    metric: { to: 4, decimals: 0, suffix: '%', label: 'contract margin protected' },
  },
  {
    role: 'Consultant',
    headline: 'Review faster, advise stronger, document everything.',
    pain: 'Hours lost to manual reviews and chasing records weaken your advisory position and bury reusable knowledge in inboxes.',
    gains: [
      'Audit-grade records generated automatically',
      'Faster technical reviews with less admin',
      'A reusable knowledge base that compounds',
    ],
    metric: { to: 60, decimals: 0, suffix: '%', label: 'less review admin' },
  },
  {
    role: 'Contractor',
    headline: 'Mobilize faster and defend every SLA.',
    pain: 'A missed KPI in week three of mobilization compounds for the life of the contract — and penalties follow.',
    gains: [
      'Day-by-day mobilization decision support',
      'Forward-looking SLA defense, not reactive firefighting',
      'Tighter scope control and protected cash flow',
    ],
    metric: { to: 90, decimals: 0, suffix: ' days', label: 'to full mobilization' },
  },
  {
    role: 'Subcontractor',
    headline: 'Clear scope, faster sign-offs, on-time payment.',
    pain: 'Ambiguous scope and slow approvals mean rework you absorb and invoices that age past terms.',
    gains: [
      'Unambiguous, agreed scope before you start',
      'Faster sign-offs and fewer rework cycles',
      'A verifiable track record that wins the next job',
    ],
    metric: { to: 0, decimals: 0, suffix: '× rework', label: 'from clear scope' },
  },
  {
    role: 'Supplier',
    headline: 'Predictable demand and trusted-vendor status.',
    pain: 'Erratic orders and procurement disputes make planning impossible and margins thin.',
    gains: [
      'Reliable demand signals to plan against',
      'Faster procurement cycles, fewer disputes',
      'Trusted-vendor standing across the portfolio',
    ],
    metric: { to: 100, decimals: 0, suffix: '%', label: 'auditable order trail' },
  },
];

export default function Stakeholders() {
  return (
    <section id="stakeholders" aria-labelledby="stakeholders-heading" className="bg-ink-950 py-24">
      <Container>
        <SectionHeading
          eyebrow="VALUE BY ROLE"
          id="stakeholders-heading"
          h2="One platform. A different win for every party to the contract."
          sub="BaytyAI aligns the whole delivery chain on a single verifiable record — so every stakeholder gains, not just the one who bought it."
          align="center"
          className="mb-16"
        />

        <div className="flex flex-col gap-6">
          {STAKEHOLDERS.map((s, i) => (
            <Reveal key={s.role} delay={(i % 2) * 0.05}>
              <article
                className={`grid grid-cols-1 gap-8 border border-ink-700 bg-ink-900 p-8 md:p-12 lg:grid-cols-12 ${
                  i % 2 === 1 ? 'lg:[direction:rtl]' : ''
                }`}
              >
                {/* Text */}
                <div className="lg:col-span-8 lg:[direction:ltr]">
                  <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-500">
                    {s.role}
                  </p>
                  <h3 className="mb-4 font-sans text-2xl font-semibold leading-snug text-ink-100 [text-wrap:balance]">
                    {s.headline}
                  </h3>
                  <p className="mb-6 font-sans text-sm leading-relaxed text-ink-300">{s.pain}</p>
                  <ul className="flex flex-col gap-3">
                    {s.gains.map((g) => (
                      <li key={g} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="mt-1.5 size-1.5 shrink-0 bg-signal-500"
                        />
                        <span className="font-sans text-sm text-ink-100">{g}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Metric */}
                <div className="flex items-center lg:col-span-4 lg:[direction:ltr]">
                  <div className="w-full border-l-2 border-signal-500 pl-6">
                    <p className="font-mono text-4xl font-medium text-ink-100 md:text-5xl">
                      <Counter
                        to={s.metric.to}
                        decimals={s.metric.decimals}
                        prefix={s.metric.prefix}
                        suffix={s.metric.suffix}
                      />
                    </p>
                    <p className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink-500">
                      {s.metric.label}
                    </p>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-8 text-center font-mono text-[11px] text-ink-500">
          Figures are illustrative internal benchmarks, not guarantees.
        </p>
      </Container>
    </section>
  );
}
