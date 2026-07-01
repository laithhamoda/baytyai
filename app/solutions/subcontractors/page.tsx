import RoleDetail from '@/components/sections/role-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'For Subcontractors - BaytyAI Global Project Control Platform' },
  description:
    'BaytyAI gives subcontractors structured installation briefs, supply editing, document access, approval tracking, and payment records across global construction projects.',
  alternates: { canonical: 'https://baytyai.com/solutions/subcontractors' },
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
      name: 'Subcontractors',
      item: 'https://baytyai.com/solutions/subcontractors',
    },
  ],
};

export default function SubcontractorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <RoleDetail
        overline="For Subcontractors"
        title="Clear scope, fair payment, on record"
        intro="Subcontractors receive precise installation briefs, edit and submit supply lists, and access exactly the documents their scope requires - with milestone decisions, payment records, and approval history kept on record."
        capabilities={[
          {
            name: 'Installation Briefs',
            body: 'Receive precise, structured scope packages for every assignment you take on.',
          },
          {
            name: 'Supply Editing',
            body: 'Edit and submit supply lists with version control and approval tracking.',
          },
          {
            name: 'Payment Records',
            body: 'Keep milestone payment status, supporting documents, and approval evidence in one place.',
          },
          {
            name: 'Document Access',
            body: 'Access the drawings and specifications relevant to your installation scope.',
          },
          {
            name: 'Verified Profile',
            body: 'Build a verified credential profile owners and contractors can trust.',
          },
          {
            name: 'Approval Tracking',
            body: 'See the real-time status of every sign-off your work depends on.',
          },
        ]}
      />
    </>
  );
}
