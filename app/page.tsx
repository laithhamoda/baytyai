import AICapabilities from '@/components/sections/ai-capabilities';
import BeforeAfter from '@/components/sections/before-after';
import FeatureTiles from '@/components/sections/feature-tiles';
import Hero from '@/components/sections/hero';
import HowItWorks from '@/components/sections/how-it-works';
import MarketplaceJoin from '@/components/sections/marketplace-join';
import PricingCards from '@/components/sections/pricing-cards';
import Problem from '@/components/sections/problem';
import { getContent } from '@/lib/cms';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Bayty AI — Construction Management Software UAE & GCC | Verified Platform' },
  description:
    'The verified construction management platform for UAE and GCC developers. Verified stakeholders, structured approvals, document hub, and a trusted professional marketplace.',
  alternates: {
    canonical: 'https://www.baytyai.com',
    languages: {
      en: 'https://www.baytyai.com',
      ar: 'https://www.baytyai.com/ar',
      'ar-AE': 'https://www.baytyai.com/ar',
      'x-default': 'https://www.baytyai.com',
    },
  },
  openGraph: {
    url: 'https://www.baytyai.com',
  },
};

export default async function Home() {
  const [overline, headline, subhead] = await Promise.all([
    getContent('hero.overline'),
    getContent('hero.headline'),
    getContent('hero.subhead'),
  ]);

  return (
    <>
      <Hero overline={overline} headline={headline} subhead={subhead} />
      <Problem />
      <BeforeAfter />
      <HowItWorks />
      <FeatureTiles />
      <AICapabilities />
      <MarketplaceJoin />
      <PricingCards />
    </>
  );
}
