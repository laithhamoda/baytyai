import { siteConfig } from '@/lib/siteConfig';

const WORLDWIDE = { '@type': 'Place', name: 'Worldwide' };

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteConfig.siteUrl}/#website`,
  name: 'BaytyAI',
  url: siteConfig.siteUrl,
  inLanguage: ['en', 'ar'],
  publisher: { '@id': `${siteConfig.siteUrl}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteConfig.siteUrl}/resources?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteConfig.siteUrl}/#organization`,
  name: 'BaytyAI',
  alternateName: 'Bayty AI',
  url: siteConfig.siteUrl,
  logo: `${siteConfig.siteUrl}/logo.png`,
  description: siteConfig.description,
  sameAs: [siteConfig.founder.linkedin],
  founder: { '@type': 'Person', name: 'Laith Hamoda' },
  areaServed: WORLDWIDE,
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'enterprise sales',
    email: siteConfig.contactEmail,
    availableLanguage: ['en', 'ar'],
  },
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
    'AI Project Control',
    'Construction Mega Projects',
    'Infrastructure Programs',
    'Contractor Verification',
    'Construction Compliance',
    'AI Prompt Engineering',
    'Global Construction Operations',
  ],
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${siteConfig.siteUrl}/#software`,
  name: 'BaytyAI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: siteConfig.siteUrl,
  description: siteConfig.description,
  featureList: [
    'AI project control center',
    'Stakeholder verification',
    'Contractor prequalification',
    'Approval workflow management',
    'Document control and version history',
    'Claims and variation tracking',
    'Risk intelligence and escalation',
    'Audit-ready decision records',
    'English and Arabic project workflows',
  ],
  audience: {
    '@type': 'BusinessAudience',
    audienceType:
      'Governments, developers, contractors, consultants, subcontractors, and suppliers on mega projects',
  },
  areaServed: WORLDWIDE,
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  '@id': `${siteConfig.siteUrl}/#service`,
  serviceType: 'AI Project Control Platform for Mega Construction and Infrastructure Projects',
  provider: { '@id': `${siteConfig.siteUrl}/#organization` },
  areaServed: WORLDWIDE,
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'BaytyAI Enterprise Platform',
    itemListElement: [
      {
        '@type': 'Offer',
        name: 'Enterprise Project Control',
        description:
          'Secure project control platform for owners, developers, contractors, consultants, and suppliers managing approvals, document control, claims, variations, and stakeholder governance.',
      },
      {
        '@type': 'Offer',
        name: 'Mega Project Command Center',
        description:
          'Custom enterprise deployment for multi-package mega projects, government-backed programs, and global infrastructure portfolios.',
      },
      {
        '@type': 'Offer',
        name: 'Verified Network and Marketplace',
        description:
          'Verified contractor, consultant, subcontractor, and supplier network for structured inquiries, quotation workflows, approvals, and auditable awards.',
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
        text: 'BaytyAI is an enterprise AI project control platform for mega construction, infrastructure, real estate, and government-backed programs. It unifies verified stakeholders, approval workflows, document control, claims, variations, risk intelligence, and compliance in one secure command center.',
      },
    },
    {
      '@type': 'Question',
      name: 'Who is BaytyAI built for?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BaytyAI is built for governments, mega-developers, public authorities, main contractors, engineering consultants, project management consultants, subcontractors, and strategic suppliers working on complex capital projects worldwide.',
      },
    },
    {
      '@type': 'Question',
      name: 'What makes BaytyAI useful for mega projects?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mega projects need verified stakeholders, controlled approvals, versioned documents, decision audit trails, authority matrices, claims evidence, variation tracking, risk escalation, and executive visibility. BaytyAI brings these workflows into one enterprise platform.',
      },
    },
    {
      '@type': 'Question',
      name: 'Does BaytyAI support Arabic and English workflows?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. BaytyAI is designed for multilingual project environments, starting with English and Arabic workflows for international project teams, authorities, contractors, consultants, and suppliers.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does BaytyAI support compliance and governance?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'BaytyAI supports role-based access, verification-gated participation, approval history, document version control, audit-ready decision logs, and enterprise compliance workflows for capital project governance.',
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

const ALL_SCHEMAS = [
  websiteSchema,
  organizationSchema,
  personSchema,
  softwareSchema,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
];

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
