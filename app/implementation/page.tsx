import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Implementation for Mega Project SaaS',
  description:
    'BaytyAI implementation model for enterprise and mega-project teams: discovery, workflow mapping, verification, data migration, integrations, training, and success management.',
  alternates: { canonical: 'https://www.baytyai.com/implementation' },
};

const steps = [
  [
    '01',
    'Executive discovery',
    'Map project scope, stakeholders, governance pain, approval risks, document flows, commercial exposure, and success metrics.',
  ],
  [
    '02',
    'Workflow configuration',
    'Configure roles, authority matrices, verification gates, approval flows, document categories, and reporting views.',
  ],
  [
    '03',
    'Data and stakeholder onboarding',
    'Import project records, invite organizations, verify companies, assign roles, and prepare bilingual operating procedures.',
  ],
  [
    '04',
    'Pilot launch',
    'Run a controlled workflow such as approvals, RFQs, consultant selection, claims evidence, or document control on one live project package.',
  ],
  [
    '05',
    'Scale and integrate',
    'Expand across packages, connect existing systems where required, train teams, and establish executive reporting cadence.',
  ],
];

export default function ImplementationPage() {
  return (
    <main className="bg-white pt-28 text-steel-900">
      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-bayty-600">
          Enterprise implementation
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl">
          From first project-control workflow to portfolio-wide operating system.
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-steel-600">
          BaytyAI is implemented around the reality of complex project delivery: many companies,
          many roles, sensitive data, high-value approvals, and leadership demand for reliable
          visibility.
        </p>
      </section>

      <section className="mx-auto max-w-container px-6 pb-20 md:px-12">
        <div className="grid gap-5">
          {steps.map(([number, title, copy]) => (
            <article
              key={number}
              className="grid gap-4 border border-steel-200 p-6 md:grid-cols-[80px_1fr]"
            >
              <p className="font-display text-4xl font-bold text-bayty-600">{number}</p>
              <div>
                <h2 className="font-sans text-xl font-semibold">{title}</h2>
                <p className="mt-2 font-sans text-sm leading-relaxed text-steel-600">{copy}</p>
              </div>
            </article>
          ))}
        </div>
        <Link
          href="/access"
          className="mt-10 inline-flex bg-bayty-500 px-6 py-3 font-sans text-sm font-semibold text-white"
        >
          Start enterprise implementation discussion
        </Link>
      </section>
    </main>
  );
}
