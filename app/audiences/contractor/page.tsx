import { Banknote, Clock, FileCheck2, Gavel, ShieldCheck, TrendingUp } from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Contractors | Get Paid Faster, Win Every Claim You Are Owed',
  description:
    'BaytyAI arms main contractors with audit-ready evidence for every variation, delay, and payment application — so claims are approved on the facts, not argued, and cash flow stays protected.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/contractor' },
};

const data: AudienceDetailData = {
  slug: 'contractor',
  breadcrumb: 'Contractor',
  headline: { plain: 'You did the work.', gold: 'Now prove it — or watch the payment disappear.' },
  sub: 'The variation was verbal, the delay was the client’s, and your payment application is stalled in review while your subcontractors and suppliers wait to be paid. Every thin paper trail is money you earned and will never see. BaytyAI turns the work you have done into evidence the other side cannot dismiss.',
  ctaLabel: 'Request contractor access',
  painOverline: 'What a Weak Record Costs You',
  painHeading: 'The margin you lose when the evidence is not clean.',
  pains: [
    {
      icon: FileCheck2,
      title: 'Variations you cannot recover',
      body: 'The instruction came by phone and the extra work is not in the contract. Without a documented, notified variation, your commercial team cannot substantiate the claim — and legitimate work is quietly written off.',
      cost: 'Undocumented variations average $45M disputed per $1B program',
    },
    {
      icon: Clock,
      title: 'Delay entitlement you cannot prove',
      body: 'You were held up by others, but the record is thin. Extension-of-time entitlement lives or dies on contemporaneous evidence captured the moment the delay occurred — not reconstructed months later.',
      cost: '1 day of delay = $50K–$500K, recoverable only with contemporaneous records',
    },
    {
      icon: Banknote,
      title: 'Cash trapped in dispute',
      body: 'Your payment application sits in review, unsubstantiated line by line, while your cash is tied up and your supply chain waits. A disputed application does not just delay payment — it starves the program.',
      cost: '90+ days average to resolve a disputed application ties up your cash',
    },
  ],
  ccOverline: 'Your Control Layer',
  ccHeading: 'Every entitlement, evidenced before you claim it.',
  ccSub:
    'BaytyAI captures every instruction, delay event, and variation as it happens — attributed, timestamped, and linked to the drawing, the notice, and the approval — so your claim is a record that already exists, not a story you assemble later.',
  capabilities: [
    {
      icon: FileCheck2,
      title: 'Every variation documented',
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
      title: 'Delay on the record',
      body: 'Capture and notify delay events the moment they occur — protecting your entitlement to time and money.',
    },
    {
      icon: ShieldCheck,
      title: 'Verified supply chain',
      body: 'Onboard verified subcontractors and suppliers so your downstream risk and compliance exposure is controlled, not inherited.',
    },
    {
      icon: TrendingUp,
      title: 'Executive-grade reporting',
      body: 'Show the client a controlled, transparent program — the reputation that wins you the next award.',
    },
  ],
  before: [
    'Verbal variations that never become a documented, notified claim',
    'Delay events captured after the fact, if at all — entitlement lost',
    'Payment applications parked in review with nothing to substantiate them',
    'Downstream risk inherited from unverified subcontractors and suppliers',
  ],
  after: [
    'Every instruction logged and notified with a complete evidence chain',
    'Delay events captured contemporaneously — entitlement to time protected',
    'Applications substantiated line by line and cleared faster',
    'A verified supply chain with controlled compliance and risk',
  ],
  closingHeading: 'Turn the work you have done into the money you are owed.',
  closingSub:
    'BaytyAI is available by enterprise invitation to contractors on major programs. Request access to begin the conversation.',
};

export default function ContractorAudiencePage() {
  return <AudienceDetail data={data} />;
}
