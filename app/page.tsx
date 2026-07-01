import A1Landing from '@/components/sections/a1-landing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BaytyAI — The Operating System for the World’s Mega Projects',
  },
  description:
    'BaytyAI is a verified, enterprise-grade operating system for mega projects — where governments, mega-developers, lead consultants, tier-1 contractors and strategic suppliers run a single program together with project governance, CRM, approvals and audit-ready document control. By invitation.',
  alternates: {
    canonical: 'https://www.baytyai.com',
    languages: {
      en: 'https://www.baytyai.com',
      ar: 'https://www.baytyai.com/ar',
      'x-default': 'https://www.baytyai.com',
    },
  },
  openGraph: {
    type: 'website',
    url: 'https://www.baytyai.com',
    title: 'BaytyAI — The Operating System for the World’s Mega Projects',
    description:
      'A verified, enterprise-grade command center where the world’s leading construction & infrastructure brands run a single program — governance, CRM, approvals and document control. By invitation.',
    siteName: 'BaytyAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaytyAI — The Operating System for the World’s Mega Projects',
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
      '@id': 'https://www.baytyai.com/#org',
      name: 'BaytyAI',
      url: 'https://www.baytyai.com',
      description:
        'Verified, enterprise-grade operating system for the world’s mega projects — program governance, CRM, approvals and audit-ready document control for governments, mega-developers, consultants, contractors and suppliers.',
      areaServed: 'Worldwide',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'BaytyAI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'A verified command center where mega-project stakeholders run one program together — project governance, enterprise CRM, controlled approvals, weighted consultant selection and audit-ready document control. Access is by verification/invitation.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is BaytyAI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BaytyAI is a verified, enterprise-grade operating system for mega projects. It gives governments, mega-developers, lead consultants, tier-1 contractors and strategic suppliers one secure command center to run a single program — unifying project governance, CRM, approvals, weighted consultant selection and audit-ready document control.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is BaytyAI for?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BaytyAI is built for the leading organizations on major construction and infrastructure programs — public authorities, mega-project owners and developers, lead consultants, tier-1 contractors and strategic suppliers. Access is granted by verification/invitation only.',
          },
        },
        {
          '@type': 'Question',
          name: 'How does BaytyAI ensure trust and governance?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Every organization is manually verified before it can transact, every inquiry, quotation, approval and decision is captured as a timestamped, audit-ready record, and consultant selection uses weighted, version-locked criteria with a plain-language explanation of the ranking.',
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
