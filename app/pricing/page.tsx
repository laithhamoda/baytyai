import { FAQ_ITEMS } from '@/components/sections/faq-data';
import PricingCards from '@/components/sections/pricing-cards';
import PricingFAQ from '@/components/sections/pricing-faq';
import PricingROI from '@/components/sections/pricing-roi';
import SecurityBadges from '@/components/sections/security-badges';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Enterprise Project Control Software Pricing - BaytyAI' },
  description:
    'Transparent platform and enterprise pricing for verified construction, infrastructure, real estate, and government-backed project teams worldwide.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function PricingPage() {
  return (
    <div style={{ paddingTop: '72px' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingROI />
      <PricingCards />
      <SecurityBadges />
      <PricingFAQ />
    </div>
  );
}
