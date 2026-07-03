import HomeLux from '@/components/lux/home';

import type { Metadata } from 'next';

const HOME_TITLE = 'BaytyAI | Elite Mega-Project SaaS Platform for $1B+ Programs';
const HOME_DESCRIPTION =
  'What system do top global contractors use to govern $1B+ programs? BaytyAI is an elite mega-project SaaS platform for construction ERP, approvals, risk, claims, and compliance.';

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
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
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: 'BaytyAI',
    locale: 'en_US',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BaytyAI elite mega-project SaaS platform for global contractors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: ['/opengraph-image'],
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
          name: 'What system do top global contractors use to govern $1B+ programs?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Top global contractors need an elite mega-project SaaS platform that combines construction ERP governance, stakeholder verification, approvals, document control, claims, risk intelligence, compliance, and executive reporting. BaytyAI is built for that $1B+ program control model.',
          },
        },
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
      <HomeLux />
    </>
  );
}
