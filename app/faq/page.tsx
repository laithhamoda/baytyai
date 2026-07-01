import FaqAccordion from '@/components/faq-accordion';
import { GEO_FAQ_ITEMS } from '@/components/sections/geo-faq-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI FAQ - Global Construction Project Control Platform',
  description:
    'Answers about BaytyAI: global mega-project control, verified stakeholders, approvals, document governance, pricing, security, and enterprise implementation.',
  alternates: { canonical: 'https://baytyai.com/faq' },
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: GEO_FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How BaytyAI professional verification works',
  description:
    'How a construction professional or organization gets verified on BaytyAI and receives verified access.',
  totalTime: 'PT24H',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload documents',
      text: 'Upload identity, company registration, trade licence, insurance, project history, and professional certificates to your BaytyAI profile.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Credential review',
      text: 'BaytyAI reviews submitted credentials and organization records before enabling verified project workflows.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Receive verified access',
      text: 'Once cleared, you receive verified access and appear in project searches matching your specialism, region, and delivery experience.',
    },
  ],
};

export default function FaqPage() {
  return (
    <div style={{ backgroundColor: '#0A1628', minHeight: '100vh' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section style={{ maxWidth: '820px', margin: '0 auto', padding: '160px 24px 120px' }}>
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Frequently Asked Questions
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: 'clamp(36px, 5.5vw, 56px)',
            lineHeight: 1.1,
            color: '#F8F6F1',
            marginBottom: '56px',
            maxWidth: '640px',
          }}
        >
          Everything you need to know about BaytyAI
        </h1>
        <FaqAccordion items={GEO_FAQ_ITEMS} />
      </section>
    </div>
  );
}
