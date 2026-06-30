import Reveal from '@/components/motion/Reveal';
import ScrollRail from '@/components/motion/ScrollRail';
import Faq from '@/components/sections/lp-faq';
import FinalCta from '@/components/sections/lp-final-cta';
import Founder from '@/components/sections/lp-founder';
import HeroAnimated from '@/components/sections/lp-hero-animated';
import Pricing from '@/components/sections/lp-pricing';
import Problem from '@/components/sections/lp-problem';
import Process from '@/components/sections/lp-process';
import Proof from '@/components/sections/lp-proof';
import Stakeholders from '@/components/sections/lp-stakeholders';
import System from '@/components/sections/lp-system';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'BaytyAI — Global Verified Marketplace for Construction & Facilities Management',
  },
  description:
    'BaytyAI connects verified clients, consultants, contractors, subcontractors, and suppliers worldwide. Post inquiries, receive quotations, route approvals, and control documents on one trusted construction & FM platform.',
  alternates: {
    canonical: 'https://baytyai.com',
    languages: {
      en: 'https://baytyai.com',
      ar: 'https://baytyai.com/ar',
      'x-default': 'https://baytyai.com',
    },
  },
};

export default function Home() {
  return (
    <>
      <ScrollRail />
      <HeroAnimated />
      <Reveal>
        <Problem />
      </Reveal>
      <Reveal>
        <System />
      </Reveal>
      <Stakeholders />
      <Reveal>
        <Proof />
      </Reveal>
      <Reveal>
        <Founder />
      </Reveal>
      <Reveal>
        <Process />
      </Reveal>
      <Reveal>
        <Pricing />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      <FinalCta />
    </>
  );
}
