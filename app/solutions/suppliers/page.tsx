import RoleDetail from '@/components/sections/role-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'For Suppliers — Bayty Construction Marketplace UAE' },
  description:
    'Bayty connects verified material and equipment suppliers to active GCC construction projects, with structured requests, quoting, and protected payments.',
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
        intro="Material and equipment suppliers connect directly to active GCC developments — receiving structured requests, submitting quotes, and getting paid through a trusted, recorded process."
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
            name: 'Protected Payments',
            body: 'Settle through milestone-based payments with a complete transaction record.',
          },
          {
            name: 'Project Discovery',
            body: 'Get matched to active GCC projects that need your product categories.',
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
