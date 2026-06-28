import { siteConfig } from '@/lib/siteConfig';

const GCC_COUNTRIES = [
  'Saudi Arabia',
  'United Arab Emirates',
  'Qatar',
  'Kuwait',
  'Bahrain',
  'Oman',
];

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.siteUrl}/#organization`,
  name: 'BaytyAI',
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/logo.png`,
  sameAs: [siteConfig.founder.linkedin],
  founder: { '@type': 'Person', name: 'Laith Hamoda' },
  areaServed: GCC_COUNTRIES,
};

const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${siteConfig.siteUrl}/#founder`,
  name: 'Laith Hamoda',
  jobTitle: 'Senior AI Prompt Engineer for Mega Projects',
  worksFor: { '@type': 'Organization', name: 'BaytyAI', url: siteConfig.siteUrl },
  url: siteConfig.founder.linkedin,
  knowsAbout: [
    'Facilities Management',
    'Construction Mega Projects',
    'AI Prompt Engineering',
    'GCC Operations',
    'HVAC Engineering',
  ],
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${siteConfig.siteUrl}/#service`,
  serviceType: 'AI Operations Infrastructure for Facilities Management and Construction',
  provider: { '@id': `${siteConfig.siteUrl}/#organization` },
  areaServed: GCC_COUNTRIES,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'BaytyAI Engagement Tiers',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Strategy Consultation',
        description:
          'Mapped against your contract portfolio. Output: prioritized intervention list. Credited toward the Diagnostic Engagement.',
        price: '750',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Diagnostic Engagement',
        description:
          'One live contract. One module deployed end to end. Full output pack delivered.',
        price: '12000',
        priceCurrency: 'USD',
      },
      {
        '@type': 'Offer',
        name: 'Embedded Engagement',
        description:
          'Portfolio-wide deployment, weekly cadence, operator handover at end of quarter.',
        price: '45000',
        priceCurrency: 'USD',
      },
    ],
  },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What is BaytyAI?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BaytyAI is an AI-native operations layer for Facilities Management and Construction mega-projects in the GCC. It is a productized library of operator-grade prompts and workflows, not a consulting retainer.',
      },
    },
    {
      '@type': 'Question',
      name: 'How is this different from hiring McKinsey, Accenture, or a Big 4 advisory?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Traditional consulting delivers a deck. BaytyAI deploys a working AI operations layer against a live contract, with measurable margin recovery and SLA outcomes — at roughly 5 to 10 percent of the cost of a comparable advisory engagement.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you work in Arabic?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All deliverables can be produced bilingually in Arabic and English. The founder operates natively in both.',
      },
    },
    {
      '@type': 'Question',
      name: 'What contract sizes do you work with?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BaytyAI is built for FM and Construction contracts above $5M in annual value. Smaller contracts are typically better served by adjacent BaytyAI training products.',
      },
    },
    {
      '@type': 'Question',
      name: 'How do you handle data residency for Saudi and UAE clients?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'All sensitive contract data can be processed against models and storage configured for in-region residency. NDA-first engagement is standard.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can you integrate with our existing CAFM platform — Maximo, Archibus, Planon, or FSI Concept?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The BaytyAI workflows are CAFM-agnostic and have been designed to layer on top of existing platforms, not replace them.',
      },
    },
    {
      '@type': 'Question',
      name: 'What is the typical ROI timeline?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'On the Contract Margin X-Ray, recovered margin is typically identified within the 2-week Diagnostic window. Realized margin recovery follows in the next operational quarter.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are NDAs and IP assignment standard?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BaytyAI signs mutual NDAs as standard, and all client-specific IP generated during an engagement is assigned to the client at handover.',
      },
    },
  ],
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: siteConfig.siteUrl,
    },
  ],
};

const ALL_SCHEMAS = [organizationSchema, personSchema, serviceSchema, faqSchema, breadcrumbSchema];

export default function JsonLd() {
  return (
    <>
      {ALL_SCHEMAS.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
