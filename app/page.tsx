import A1Landing from '@/components/sections/a1-landing';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BaytyAI - AI Project Control for Global Mega Projects',
  },
  description:
    'BaytyAI is an enterprise AI project control platform for mega construction, infrastructure, real estate, and government-backed programs worldwide: verified stakeholders, approvals, document control, claims, variations, risk intelligence, and compliance.',
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
    title: 'BaytyAI - AI Project Control for Global Mega Projects',
    description:
      'A verified enterprise command center for mega-project approvals, documents, contractors, claims, variations, risks, compliance, and audit-ready decisions.',
    siteName: 'BaytyAI',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BaytyAI - AI Project Control for Global Mega Projects',
    description:
      'Enterprise AI project control for governments, developers, contractors, consultants, and suppliers delivering global mega projects.',
  },
};

const JSONLD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://www.baytyai.com/#org',
      name: 'BaytyAI',
      url: 'https://www.baytyai.com',
      description:
        'Enterprise AI project control platform for mega construction, infrastructure, real estate, and government-backed programs worldwide.',
      areaServed: 'Worldwide',
    },
    {
      '@type': 'SoftwareApplication',
      name: 'BaytyAI',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      description:
        'Verified project command center for approvals, document control, contractor verification, claims, variations, risk intelligence, compliance, and audit-ready decisions.',
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is BaytyAI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BaytyAI is an enterprise AI project control platform for mega construction, infrastructure, real estate, and government-backed programs. It unifies verified stakeholders, approvals, document control, claims, variations, risk intelligence, compliance, and audit-ready decisions.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who uses BaytyAI?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'BaytyAI is built for governments, public authorities, mega-developers, owners, main contractors, engineering consultants, project management consultants, subcontractors, and strategic suppliers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why is BaytyAI relevant for mega projects?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Mega projects require verified stakeholders, controlled approvals, document governance, claims evidence, variation tracking, authority matrices, risk escalation, and executive visibility. BaytyAI brings these controls into one secure platform.',
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
