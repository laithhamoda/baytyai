import { Banknote, FileCheck2, Gavel, Clock, TrendingUp, ShieldCheck } from 'lucide-react';

import AudiencePage, { type AudienceContent } from '@/components/lux/audience-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Contractors | Get Paid Faster and Win Every Claim You Are Owed',
  description:
    'BaytyAI arms main contractors with audit-ready evidence for every variation, delay, and payment application — so claims are approved, not argued, and cash flow stays protected.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/contractor' },
};

const content: AudienceContent = {
  eyebrow: 'For the Contractor',
  headline: (
    <>
      You did the work. Now prove it — or
      <span className="text-gold"> watch the payment disappear.</span>
    </>
  ),
  lede: 'The variation was verbal. The delay was the client’s, but the record is thin. Your payment application stalls in review while your subcontractors and suppliers wait to be paid. Every weak paper trail is money you earned and will never see.',
  costs: [
    {
      figure: '90+ days',
      label:
        'How long a disputed payment application can sit unresolved while your cash is tied up.',
    },
    {
      figure: 'Millions',
      label:
        'The value of legitimate claims written off every year because the evidence was not clean.',
    },
    {
      figure: 'Your margin',
      label:
        'What a single unrecoverable variation quietly erases from an already thin project margin.',
    },
  ],
  shift: {
    heading: 'From arguing for your money to presenting the proof.',
    paragraphs: [
      'Every instruction, delay event, and variation is captured as it happens — attributed, timestamped, and linked to the drawing, the notice, and the approval. Your claim is not a story you assemble later; it is a record that already exists.',
      'When you submit, you submit with evidence the other side cannot dismiss. Applications move faster, claims are approved on the facts, and the cash that keeps your program alive stops getting trapped in dispute.',
    ],
  },
  outcomesHeading: 'Protect your margin. Accelerate your cash.',
  outcomes: [
    {
      icon: FileCheck2,
      title: 'Every variation, documented',
      body: 'Verbal instructions become logged, notified events with a full evidence chain — no more unpaid work you cannot prove.',
    },
    {
      icon: Gavel,
      title: 'Claims built to win',
      body: 'AI assembles the delay and change record into a claim the client cannot wave away, backed by contemporaneous evidence.',
    },
    {
      icon: Banknote,
      title: 'Payment applications that clear',
      body: 'Substantiate every line with linked evidence so applications are approved, not parked, and your cash cycle tightens.',
    },
    {
      icon: Clock,
      title: 'Delay, on the record',
      body: 'Capture and notify delay events the moment they occur — protecting your entitlement to time and money.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified supply chain',
      body: 'Onboard verified subcontractors and suppliers, so your downstream risk and compliance exposure is controlled, not inherited.',
    },
    {
      icon: TrendingUp,
      title: 'Executive-grade reporting',
      body: 'Show the client a controlled, transparent program — the reputation that wins you the next award.',
    },
  ],
  closing: 'Turn the work you have done into the money you are owed.',
};

export default function ContractorAudiencePage() {
  return <AudiencePage slug="contractor" content={content} />;
}
