import { Banknote, CheckCircle2, Clock, FileCheck2, HardHat, ShieldCheck } from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Subcontractors | Prove Your Work, Protect Your Cash Flow',
  description:
    'BaytyAI gives subcontractors a verified, audit-ready record of instructions, progress, and variations — so payment is faster, disputes are fewer, and cash flow is protected.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/subcontractor' },
};

const data: AudienceDetailData = {
  slug: 'subcontractor',
  breadcrumb: 'Subcontractor',
  headline: {
    plain: 'You did the work.',
    gold: 'The scope changed without a written instruction.',
  },
  sub: 'You are the furthest party from the money and the first to feel it run dry. You did exactly what you were told — but the instruction came by phone and the extra work is not in your contract. BaytyAI records every instruction and every day of progress in a system the whole program trusts, so your entitlement stops depending on your memory.',
  ctaLabel: 'Request subcontractor access',
  painOverline: 'What an Informal Site Costs You',
  painHeading: 'The cash you lose when the record is not yours.',
  pains: [
    {
      icon: FileCheck2,
      title: 'Extra work you were never paid for',
      body: 'The instruction to do more came on site, informally. It is not in the contract and it was never captured as a variation — so the work you actually did becomes a favour you gave away for free.',
      cost: 'Informal instructions become unpaid work — and you are last in the payment chain',
    },
    {
      icon: Banknote,
      title: 'Cash flow that runs dry',
      body: 'Payment is late, the main contractor blames the client, and your crew and suppliers still need paying. A few months of trapped cash is enough to end a specialist trade with thin reserves.',
      cost: 'A few months of trapped cash flow can push a specialist trade into insolvency',
    },
    {
      icon: Clock,
      title: 'Valuations you cannot challenge',
      body: 'Deductions and disputed valuations arrive with no evidence to contest them, because progress and disruption were never recorded as they happened.',
      cost: '68% of mega-project disputes cite documentation or verification failures',
    },
  ],
  ccOverline: 'Your Protection',
  ccHeading: 'Every hour you put in, on a record everyone can see.',
  ccSub:
    'BaytyAI captures every instruction you receive, every day of progress you complete, and every extra you are asked to do — time-stamped and attributable — so you stop chasing payment on the strength of your memory and start pointing to the record.',
  capabilities: [
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
      body: 'Your verified status makes you a trusted, low-risk trade that main contractors want back on the next job.',
    },
    {
      icon: HardHat,
      title: 'Compliance made simple',
      body: 'Keep credentials, insurances, and safety records current in one place — never lose work over an expired document.',
    },
  ],
  before: [
    'Extra work instructed on site and never captured as a variation',
    'Progress undocumented, so valuations understate what you built',
    'Deductions you cannot contest because you hold no contemporaneous record',
    'Payment dependent on someone else’s paperwork, always arriving last',
  ],
  after: [
    'Every instruction logged with a timestamp — extra work becomes extra pay',
    'Progress recorded with evidence, so valuations reflect reality',
    'Disruption and delay captured the moment they happen',
    'Substantiated applications that clear faster, with fewer deductions',
  ],
  closingHeading: 'Prove your work. Get paid for it. Stay in business.',
  closingSub:
    'BaytyAI is available by enterprise invitation to specialist trades on major programs. Request access to begin the conversation.',
};

export default function SubcontractorAudiencePage() {
  return <AudienceDetail data={data} />;
}
