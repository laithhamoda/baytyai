import { Banknote, CheckCircle2, FileCheck2, HardHat, ShieldCheck, Clock } from 'lucide-react';

import AudiencePage, { type AudienceContent } from '@/components/lux/audience-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Subcontractors | Prove Your Work and Protect Your Cash Flow',
  description:
    'BaytyAI gives subcontractors a verified, audit-ready record of instructions, progress, and variations — so payment is faster, disputes are fewer, and your cash flow is protected.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/subcontractor' },
};

const content: AudienceContent = {
  eyebrow: 'For the Subcontractor',
  headline: (
    <>
      You are the furthest from the money and
      <span className="text-gold"> the first to feel it run dry.</span>
    </>
  ),
  lede: 'You did exactly what you were told, but the instruction came by phone and the extra work is not in the contract. Payment is late, the main contractor blames the client, and your crew, your suppliers, and your survival depend on cash that keeps slipping.',
  costs: [
    {
      figure: 'Last',
      label:
        'Where the subcontractor sits in the payment chain — and the first to be squeezed when it tightens.',
    },
    {
      figure: 'Unpaid',
      label: 'The fate of extra work instructed informally and never captured as a variation.',
    },
    {
      figure: 'Insolvency',
      label:
        'What a few months of trapped cash flow does to a specialist trade with thin reserves.',
    },
  ],
  shift: {
    heading: 'From taking their word for it to holding the evidence.',
    paragraphs: [
      'Every instruction you receive, every day of progress you complete, every extra you are asked to do is recorded and time-stamped in a system the whole program trusts — not on a scrap of paper only you hold.',
      'You no longer chase payment on the strength of your memory. You point to the record everyone can see. Your entitlement is evidenced, your applications are substantiated, and your cash flow stops being at the mercy of someone else’s paperwork.',
    ],
  },
  outcomesHeading: 'Get recognised for every hour you put in.',
  outcomes: [
    {
      icon: FileCheck2,
      title: 'Instructions captured',
      body: 'Informal, on-site instructions become logged events with a timestamp and an author — so extra work is extra pay, not a favour.',
    },
    {
      icon: CheckCircle2,
      title: 'Progress you can prove',
      body: 'Record completed work as it happens, with evidence, so valuations reflect what you actually built.',
    },
    {
      icon: Banknote,
      title: 'Faster, cleaner payment',
      body: 'Substantiated applications move through the chain with fewer disputes and fewer deductions you cannot challenge.',
    },
    {
      icon: Clock,
      title: 'Delay and disruption logged',
      body: 'Capture the moment you are held up by others — protecting your right to be paid for time that was not your fault.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified standing',
      body: 'Your verified status on the platform makes you a trusted, low-risk trade that main contractors want back on the next job.',
    },
    {
      icon: HardHat,
      title: 'Compliance made simple',
      body: 'Keep your credentials, insurances, and safety records current in one place — never lose work over an expired document.',
    },
  ],
  closing: 'Prove your work. Get paid for it. Stay in business.',
};

export default function SubcontractorAudiencePage() {
  return <AudiencePage slug="subcontractor" content={content} />;
}
