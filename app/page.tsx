import Faq from '@/components/sections/lp-faq';
import FinalCta from '@/components/sections/lp-final-cta';
import Founder from '@/components/sections/lp-founder';
import Hero from '@/components/sections/lp-hero';
import Pricing from '@/components/sections/lp-pricing';
import Problem from '@/components/sections/lp-problem';
import Process from '@/components/sections/lp-process';
import Proof from '@/components/sections/lp-proof';
import System from '@/components/sections/lp-system';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute:
      'BaytyAI — AI-Native Operations Infrastructure for GCC FM & Construction | Strategy Consultation',
  },
  description:
    'Operator-grade AI prompt libraries and workflows that protect contract margin, accelerate mobilization, and harden SLA performance on FM and Construction contracts above $5M in the GCC.',
  alternates: {
    canonical: 'https://www.baytyai.com',
    languages: {
      en: 'https://www.baytyai.com',
      ar: 'https://www.baytyai.com/ar',
      'x-default': 'https://www.baytyai.com',
    },
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <System />
      <Proof />
      <Founder />
      <Process />
      <Pricing />
      <Faq />
      <FinalCta />
    </>
  );
}
