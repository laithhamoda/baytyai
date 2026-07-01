import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Construction Compliance and Governance Platform',
  description:
    'BaytyAI supports mega-project compliance with verified stakeholders, approval history, document governance, authority matrices, bilingual workflows, and audit-ready decision records.',
  alternates: { canonical: 'https://www.baytyai.com/compliance' },
};

const areas = [
  'UAE and Saudi PDPL readiness planning for enterprise deployments',
  'GDPR-aware privacy and consent practices for global project teams',
  'Document version control for contracts, drawings, RFIs, submittals, and approval packs',
  'Authority matrix governance for owner, consultant, contractor, and supplier actions',
  'Audit trails for awards, approvals, access requests, verification decisions, and project records',
  'Bilingual English and Arabic operating model for GCC project governance',
];

export default function CompliancePage() {
  return (
    <main className="bg-white pt-28 text-steel-900">
      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-bayty-600">
          Compliance and governance
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl">
          Governance infrastructure for accountable mega-project delivery.
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-steel-600">
          BaytyAI helps project owners and delivery partners create a reliable compliance layer:
          verified stakeholders, controlled approvals, governed documents, structured submissions,
          and decision records that can be reviewed by leadership, auditors, and commercial teams.
        </p>
      </section>

      <section className="mx-auto max-w-container px-6 pb-20 md:px-12">
        <h2 className="font-display text-4xl font-bold">Compliance capabilities</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {areas.map((area) => (
            <div
              key={area}
              className="border border-steel-200 p-5 font-sans text-sm leading-relaxed text-steel-700"
            >
              {area}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
