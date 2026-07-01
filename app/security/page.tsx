import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Security for Mega Project Software',
  description:
    'BaytyAI security posture for enterprise mega-project teams: verification-gated access, role-based controls, audit logs, encryption, data governance, and compliance readiness.',
  alternates: { canonical: 'https://www.baytyai.com/security' },
};

const controls = [
  'Role-based access control for owners, consultants, contractors, suppliers, admins, and invited users',
  'Verification-gated organization participation before sensitive workflows are enabled',
  'Audit-ready records for approvals, decisions, quotations, awards, document changes, and admin actions',
  'Encryption-aware architecture for data in transit and sensitive stored records',
  'Private dashboard routes separated from public marketing and indexable content',
  'Enterprise implementation planning for SSO, data residency, backups, and disaster recovery',
  'Operational review process for supplier/subprocessor, access, and administrator governance',
  'Security roadmap aligned to ISO 27001 and SOC 2 expectations for enterprise buyers',
];

export default function SecurityPage() {
  return (
    <main className="bg-white pt-28 text-steel-900">
      <section className="mx-auto max-w-container px-6 py-20 md:px-12">
        <p className="font-mono text-xs font-semibold uppercase tracking-widest text-bayty-600">
          Security and trust
        </p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold leading-tight md:text-6xl">
          Enterprise security posture for high-value construction and infrastructure programs.
        </h1>
        <p className="mt-6 max-w-3xl font-sans text-lg leading-relaxed text-steel-600">
          Mega-project software must protect commercial decisions, contractor data, claims evidence,
          technical documents, and approval history. BaytyAI is designed around verified access,
          controlled workflows, and audit-ready governance.
        </p>
      </section>

      <section className="mx-auto max-w-container px-6 pb-20 md:px-12">
        <h2 className="font-display text-4xl font-bold">Security controls</h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {controls.map((control) => (
            <div
              key={control}
              className="border border-steel-200 p-5 font-sans text-sm leading-relaxed text-steel-700"
            >
              {control}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-steel-200 bg-steel-50">
        <div className="mx-auto max-w-container px-6 py-16 md:px-12">
          <h2 className="font-display text-4xl font-bold">Enterprise security roadmap</h2>
          <p className="mt-5 max-w-3xl font-sans text-base leading-relaxed text-steel-600">
            For enterprise and government deployments, BaytyAI can align implementation with SSO,
            dedicated environments, data residency requirements, formal penetration testing, backup
            policies, disaster recovery targets, and security review documentation.
          </p>
        </div>
      </section>
    </main>
  );
}
