import A1Landing from '@/components/sections/a1-landing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BaytyAI — Global Verified Marketplace for Construction & Facilities Management',
  },
  description:
    'BaytyAI connects verified clients, consultants, contractors, subcontractors, and suppliers worldwide. Post inquiries, receive quotations, route approvals, and run transparent, weighted consultant selection on one trusted construction & FM platform.',
  alternates: {
    canonical: 'https://baytyai.com',
    languages: {
      en: 'https://baytyai.com',
      ar: 'https://baytyai.com/ar',
      'x-default': 'https://baytyai.com',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://baytyai.com',
    title: 'BaytyAI — Global Verified Construction & FM Marketplace',
    description:
      'The verified network for construction & facilities management — structured inquiries, transparent quotations, weighted consultant selection, approvals and document control.',
    siteName: 'BaytyAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaytyAI — Global Verified Construction & FM Marketplace',
    description:
      'The verified network for construction & facilities management. Verified stakeholders, transparent procurement, explainable selection.',
  },
};

// SEO/GEO: rich, answer-engine-friendly structured data describing the product.
const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://baytyai.com/#org',
      name: 'BaytyAI',
      url: 'https://baytyai.com',
      description:
        'Global verified marketplace and operations platform for construction and facilities management.',
      areaServed: 'Worldwide',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'BaytyAI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description:
        'Verified marketplace connecting clients, consultants, contractors, subcontractors and suppliers, with structured inquiries, quotations, approvals, weighted consultant selection and document control.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is BaytyAI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BaytyAI is a global, verified marketplace and operations platform for construction and facilities management that connects clients, consultants, contractors, subcontractors and suppliers with structured inquiries, transparent quotations, approvals and explainable consultant selection.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does BaytyAI build trust?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every organization is manually verified before it can transact, every decision is auditable, and consultant selection uses weighted, version-locked criteria with a plain-language explanation of why one party ranks higher.',
          },
        },
      ],
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD) }}
      />
      <A1Landing />
    </>
  );
}
