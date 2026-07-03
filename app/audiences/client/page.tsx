import { Eye, ShieldCheck, TrendingDown, ScrollText, Landmark, Scale } from 'lucide-react';

import AudiencePage, { type AudienceContent } from '@/components/lux/audience-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Clients & Owners | Govern Your $1B+ Program with Total Visibility',
  description:
    'BaytyAI gives mega-project owners real-time, audit-ready control over approvals, risk, claims, and every verified stakeholder — without waiting for a report you cannot trust.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/client' },
};

const content: AudienceContent = {
  eyebrow: 'For the Client / Owner',
  headline: (
    <>
      You are accountable for a billion-dollar program you can only see
      <span className="text-gold"> a month after it goes wrong.</span>
    </>
  ),
  lede: 'By the time the monthly report lands on your desk, the delay is baked in, the variation is signed, and the exposure is already yours. The people you fund make decisions daily that you learn about far too late to influence.',
  costs: [
    {
      figure: '30 days',
      label:
        'The typical lag between a decision on site and the moment it reaches the owner in a report.',
    },
    {
      figure: '10–20%',
      label:
        'The share of a mega-project budget consumed by change and claims that visibility could have contained.',
    },
    {
      figure: 'Yours',
      label: 'Whose reputation absorbs a public overrun, regardless of who caused it.',
    },
  ],
  shift: {
    heading: 'From reading the past to governing the present.',
    paragraphs: [
      'A report tells you what already happened. BaytyAI shows you what is happening — every approval in flight, every risk rising, every claim forming — in real time, with the evidence attached.',
      'You stop being the last person to know and become the authority who sets the rules the whole program runs by. Nothing of consequence moves without a verified, traceable decision you can stand behind in front of a board, a ministry, or a court.',
    ],
  },
  outcomesHeading: 'Command of the program, not custody of its paperwork.',
  outcomes: [
    {
      icon: Eye,
      title: 'Real-time program visibility',
      body: 'Live status of approvals, risks, claims, and spend across every package — no waiting, no filtered narrative from the party being measured.',
    },
    {
      icon: ShieldCheck,
      title: 'Only verified parties act',
      body: 'Every consultant, contractor, and supplier is identity- and credential-verified before they can transact on your program. No unknown party, no hidden liability.',
    },
    {
      icon: TrendingDown,
      title: 'Risk caught early',
      body: 'AI surfaces cost, schedule, and claim exposure while you can still act on it — not after it has hardened into an overrun.',
    },
    {
      icon: ScrollText,
      title: 'Audit-ready by default',
      body: 'Every decision is captured as timestamped evidence. Board reviews, government audits, and disputes are answered from a single verified record.',
    },
    {
      icon: Scale,
      title: 'Defensible governance',
      body: 'Authority matrices enforce who may approve what. Your controls are provable, not aspirational — a shield when scrutiny comes.',
    },
    {
      icon: Landmark,
      title: 'Confidence for stakeholders',
      body: 'Give ministries, boards, and lenders the transparency they demand, in English and Arabic, without assembling it by hand each cycle.',
    },
  ],
  closing: 'Govern your program the way its scale demands.',
};

export default function ClientAudiencePage() {
  return <AudiencePage slug="client" content={content} />;
}
