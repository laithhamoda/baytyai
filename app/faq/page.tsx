import FaqAccordion from '@/components/faq-accordion';
import { GEO_FAQ_ITEMS } from '@/components/sections/geo-faq-data';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bayty FAQ — Construction Management Platform UAE & GCC',
  description:
    'Answers about Bayty: what it is, who uses it, how verification works, pricing, security, and the verified professional marketplace for GCC construction.',
  alternates: { canonical: 'https://www.baytyai.com/faq' },
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
  name: 'How Bayty professional verification works',
  description:
    'How a construction professional gets verified on Bayty and receives the Bayty Verified badge.',
  totalTime: 'PT24H',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Upload documents',
      text: 'Upload your Emirates ID, trade licence, and professional certificates to your Bayty profile.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Government-linked check',
      text: 'Bayty runs a government-linked credential check, typically completed within 24 hours.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Receive verified badge',
      text: 'Once cleared, you receive the Bayty Verified badge and appear in marketplace searches matching your specialism and GCC location.',
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
          Everything you need to know about Bayty
        </h1>
        <FaqAccordion items={GEO_FAQ_ITEMS} />
      </section>
    </div>
  );
}
