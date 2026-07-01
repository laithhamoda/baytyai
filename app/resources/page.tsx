import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mega Project Control Resources',
  description:
    'BaytyAI resources for AI construction management, mega project control, approvals, contractor verification, document control, claims, variations, and compliance.',
  alternates: { canonical: 'https://www.baytyai.com/resources' },
};

const resources = [
  {
    title: 'Mega Project Control Checklist',
    copy: 'A practical checklist for owners and delivery teams reviewing approvals, document control, authority matrices, risk visibility, and commercial evidence.',
  },
  {
    title: 'Contractor Prequalification Framework',
    copy: 'A structured model for evaluating licenses, trade categories, insurance, certifications, project history, financial capacity, HSE records, and verification status.',
  },
  {
    title: 'Approval Matrix Template',
    copy: 'A governance template for owner, consultant, contractor, subcontractor, and supplier decisions across RFIs, drawings, submittals, awards, payments, and variations.',
  },
  {
    title: 'Claims and Variation Evidence Guide',
    copy: 'A commercial-control guide for connecting decisions, documents, approvals, dates, scope changes, and responsible parties into defensible project records.',
  },
  {
    title: 'AI Construction Management Buyer Guide',
    copy: 'A buyer guide for evaluating AI project control, document intelligence, risk detection, bilingual workflows, integrations, and enterprise security.',
  },
  {
    title: 'GCC Project Governance Brief',
    copy: 'A briefing for developers, government entities, contractors, and consultants operating across UAE, Saudi Arabia, Qatar, Kuwait, Oman, and Bahrain.',
  },
];

export default function ResourcesPage() {
  return (
    <main className="bg-white pt-28 text-steel-900">
      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-bayty-600">
          Resources
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl">
          Guides for AI construction management and mega-project control.
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-steel-600">
          These resource hubs are designed for search engines, answer engines, and enterprise buyers
          researching project-control software for high-value construction, infrastructure, real
          estate, and government-backed programs.
        </p>
      </section>
      <section className="mx-auto grid max-w-container gap-5 px-6 pb-20 md:grid-cols-2 md:px-12">
        {resources.map((resource) => (
          <article key={resource.title} className="border border-steel-200 p-6">
            <h2 className="font-sans text-xl font-semibold text-steel-900">{resource.title}</h2>
            <p className="mt-3 font-sans text-sm leading-relaxed text-steel-600">{resource.copy}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
