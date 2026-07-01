import RoleDetail from '@/components/sections/role-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'For Suppliers - BaytyAI Global Construction Marketplace' },
  description:
    'BaytyAI connects verified material and equipment suppliers to active global construction and infrastructure projects, with structured requests, quoting, and protected records.',
  alternates: { canonical: 'https://baytyai.com/solutions/suppliers' },
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
      name: 'Suppliers',
      item: 'https://baytyai.com/solutions/suppliers',
    },
  ],
};

export default function SuppliersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <RoleDetail
        overline="For Suppliers"
        title="Reach verified projects, supply with confidence"
        intro="Material and equipment suppliers connect directly to active developments worldwide - receiving structured requests, submitting quotes, and participating through a trusted, recorded process."
        capabilities={[
          {
            name: 'Verified Listing',
            body: 'List your catalogue and credentials in a marketplace owners and contractors trust.',
          },
          {
            name: 'Structured Requests',
            body: 'Receive itemised material and equipment requests tied to specific projects.',
          },
          {
            name: 'Quoting',
            body: 'Submit and track quotes with a clear, recorded approval status.',
          },
          {
            name: 'Protected Records',
            body: 'Keep award, quotation, payment, and delivery records linked to the project trail.',
          },
          {
            name: 'Project Discovery',
            body: 'Get matched to active projects worldwide that need your product categories.',
          },
          {
            name: 'Document Access',
            body: 'Access the specifications and schedules relevant to your supply scope.',
          },
        ]}
      />
    </>
  );
}
