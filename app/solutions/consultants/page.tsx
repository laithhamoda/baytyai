import RoleDetail from '@/components/sections/role-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'For Consultants & Engineers — Bayty Platform UAE' },
  description:
    'Bayty gives consultants and engineers contract execution, supervision, design revision management, and technical scope tools on one platform.',
  alternates: { canonical: 'https://baytyai.com/solutions/consultants' },
};

const breadcrumb = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://baytyai.com' },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Solutions',
      item: 'https://baytyai.com/solutions',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Consultants & Engineers',
      item: 'https://baytyai.com/solutions/consultants',
    },
  ],
};

export default function ConsultantsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <RoleDetail
        overline="For Consultants & Engineers"
        title="Execute, supervise, and manage revisions"
        intro="Consultants, design engineers, and MEP specialists manage contract execution, supervision, technical scope, and revisions — with every decision recorded and verifiable."
        capabilities={[
          {
            name: 'Contract Execution',
            body: 'Manage and track contractual deliverables with structured milestones.',
          },
          {
            name: 'Supervision',
            body: 'Oversee installation and site work with documented inspection records.',
          },
          {
            name: 'Design Revisions',
            body: 'Manage drawing briefs and revision cycles with full version history.',
          },
          {
            name: 'Technical Scope',
            body: 'Define and manage MEP, HVAC, and fit-out specifications end to end.',
          },
          {
            name: 'Revision Sign-off',
            body: 'Approve or return revisions with a complete, auditable decision trail.',
          },
          {
            name: 'Team Directory',
            body: 'Connect with verified counterparties across every active project.',
          },
        ]}
      />
    </>
  );
}
