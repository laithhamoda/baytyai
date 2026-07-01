import Link from 'next/link';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Project Control Platform for Mega Projects',
  description:
    'BaytyAI gives governments, developers, contractors, consultants, and suppliers one secure AI command center for mega-project approvals, documents, risks, claims, variations, and compliance.',
  alternates: { canonical: 'https://www.baytyai.com/mega-projects' },
};

const capabilities = [
  'Executive project control center for owners and program leadership',
  'Verified stakeholder onboarding for contractors, consultants, suppliers, and authorities',
  'Authority matrix workflows for approvals, awards, payment certificates, and variations',
  'Document control with version history, decision records, and audit-ready evidence',
  'AI risk intelligence for delayed approvals, missing documents, claims exposure, and scope drift',
  'Multilingual workflows for international delivery teams and regional project environments',
];

const useCases = [
  {
    title: 'Approval Delay Control',
    copy: 'Identify bottlenecks across drawings, RFIs, payment certificates, procurement approvals, consultant reviews, and owner decisions before they become claims.',
  },
  {
    title: 'Claims and Variation Evidence',
    copy: 'Connect decisions, documents, dates, roles, scope changes, and approval history into a defensible timeline for commercial teams.',
  },
  {
    title: 'Contractor and Consultant Governance',
    copy: 'Verify organizations, enforce role-based participation, compare structured submissions, and preserve the full award trail.',
  },
  {
    title: 'Portfolio Visibility',
    copy: 'Give executives a consistent view across projects, packages, contractors, open decisions, risk exposure, and unresolved approvals.',
  },
];

const industries = [
  'Mixed-use real estate developments',
  'Airports, ports, rail, roads, and utilities',
  'Government-backed capital programs',
  'Hospitality, resorts, and destination projects',
  'Industrial, energy, logistics, and special economic zones',
  'Smart city and urban transformation programs',
];

export default function MegaProjectsPage() {
  return (
    <main className="bg-white pt-28 text-steel-900">
      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-bayty-600">
          Mega project control
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl">
          AI project control for the world&apos;s most complex construction and infrastructure
          programs.
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-steel-600">
          BaytyAI is built for mega-project environments where every delayed approval, missing
          document, unverified party, undocumented decision, and uncontrolled variation can create
          commercial exposure. It gives leadership one verified system of record for project
          governance.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link
            href="/access"
            className="bg-bayty-500 px-6 py-3 font-sans text-sm font-semibold text-white"
          >
            Request enterprise access
          </Link>
          <Link
            href="/security"
            className="border border-steel-300 px-6 py-3 font-sans text-sm font-semibold text-steel-900"
          >
            Review security posture
          </Link>
        </div>
      </section>

      <section className="border-y border-steel-200 bg-steel-50">
        <div className="mx-auto grid max-w-container gap-5 px-6 py-16 md:grid-cols-3 md:px-12">
          {['Governance', 'Commercial Control', 'Verified Network'].map((item) => (
            <div key={item} className="border border-steel-200 bg-white p-6">
              <h2 className="font-sans text-lg font-semibold text-steel-900">{item}</h2>
              <p className="mt-3 font-sans text-sm leading-relaxed text-steel-600">
                Enterprise workflows designed for owners, authorities, consultants, contractors, and
                suppliers operating under high-value capital-project pressure.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <h2 className="font-display text-4xl font-bold">Core capabilities</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {capabilities.map((capability) => (
            <div
              key={capability}
              className="border border-steel-200 p-5 font-sans text-sm text-steel-700"
            >
              {capability}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#17284a] text-white">
        <div className="mx-auto max-w-container px-6 py-20 md:px-12">
          <h2 className="font-display text-4xl font-bold">High-value use cases</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {useCases.map((useCase) => (
              <article key={useCase.title} className="border border-white/15 bg-white/5 p-6">
                <h3 className="font-sans text-lg font-semibold">{useCase.title}</h3>
                <p className="mt-3 font-sans text-sm leading-relaxed text-white/70">
                  {useCase.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <h2 className="font-display text-4xl font-bold">Built for global mega-project sectors</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {industries.map((industry) => (
            <p
              key={industry}
              className="border border-steel-200 p-5 font-sans text-sm text-steel-700"
            >
              {industry}
            </p>
          ))}
        </div>
      </section>
    </main>
  );
}
