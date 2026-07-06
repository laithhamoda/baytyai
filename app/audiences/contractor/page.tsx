import {
  AlertTriangle,
  BarChart2,
  Clock,
  FileText,
  Layers,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
} from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Contractors | Commercial Control Across Every Package and Claim',
  description:
    "BaytyAI gives Tier-1 contractors governed control of packages, subcontractors, approvals, variations, and claims evidence — so you recover what you're owed and never absorb losses you didn't create.",
  alternates: { canonical: 'https://www.baytyai.com/audiences/contractor' },
};

const data: AudienceDetailData = {
  slug: 'contractor',
  breadcrumb: 'Contractor',
  headline: {
    plain: 'You managed the package.',
    gold: 'The claim came from a decision you never made.',
  },
  sub: 'On every mega-project, contractors absorb the commercial consequences of approvals their owners delayed, variations their consultants instructed informally, and scope changes their subcontractors executed without a signed order. BaytyAI gives you the control layer to document every instruction, every delay, and every variation — so you recover what you are owed.',
  ctaLabel: 'Request contractor access',
  painOverline: 'What Managing a Program You Do Not Control Costs You',
  painHeading: "The commercial exposure of managing a program you don't fully control.",
  pains: [
    {
      icon: TrendingDown,
      title: 'Variation orders you performed but cannot recover',
      body: "The owner's representative gave an oral instruction on site. You performed the work. At final account, they dispute the instruction because it was never formally ordered. Without a documented instruction trail, you absorb the cost — even though you were told to perform it.",
      cost: 'Contractors recover only 34% of instructed variation costs when records are informal',
    },
    {
      icon: Clock,
      title: 'Delay claims you cannot substantiate',
      body: "The consultant's drawing approval took 31 days when 14 were agreed. You submitted an Extension of Time. They rejected it because you cannot show the exact date the drawing was submitted, when they received it, and how long their review took. The data exists — just not in one place, not in a format that proves anything.",
      cost: 'Unsubstantiated delay claims lose 61% of their value in dispute resolution',
    },
    {
      icon: Package,
      title: 'Subcontractor scope drift you are responsible for',
      body: 'Your subcontractor performed additional work based on a verbal instruction from your site manager. Now they are claiming. The additional work is real. The instruction is disputed. Because you hold the main contract, the claim flows up to you — and you hold it.',
      cost: 'Subcontractor variation disputes account for 38% of contractor commercial losses on mega-projects',
    },
  ],
  ccOverline: 'Your Control Layer',
  ccHeading: 'Control every package, document every instruction, protect every claim.',
  ccSub:
    'BaytyAI gives Tier-1 contractors a governed workspace to manage subcontractors, document instructions, track approval dependencies, and build a defensible commercial record — from contract award to final account.',
  capabilities: [
    {
      icon: Layers,
      title: 'Package management',
      body: 'Manage every subcontract package from award through completion. Scope, programme, RFQs, variations, and performance — all in one governed system.',
    },
    {
      icon: FileText,
      title: 'Instruction documentation',
      body: 'Every site instruction, direction, or scope change is formally issued through BaytyAI — with issuer identity, date, and scope. Oral instructions have no place in your record.',
    },
    {
      icon: AlertTriangle,
      title: 'Approval dependency tracking',
      body: 'When an owner or consultant approval is blocking your progress, BaytyAI records the submission date, the SLA, and every day the approval is overdue. Your delay claim is built as the delay happens.',
    },
    {
      icon: TrendingUp,
      title: 'Variation order management',
      body: 'Every variation is formally initiated, documented with scope and commercial value, tracked through approval, and preserved for final account. No variation is absorbed without a record.',
    },
    {
      icon: Users,
      title: 'Subcontractor governance',
      body: 'Issue formal instructions to subcontractors. Track scope performance. Record variations at the point of instruction — not at the point of dispute.',
    },
    {
      icon: BarChart2,
      title: 'Commercial exposure dashboard',
      body: 'See your open claims, pending approvals, variation status, and subcontractor exposure in one executive view — updated in real time, not assembled for monthly reporting.',
    },
  ],
  before: [
    'Oral instruction performed. No formal order issued. Final account dispute absorbs the loss.',
    'Delay claim submitted. Rejected for insufficient evidence. EOT value written off.',
    'Subcontractor variation escalates. Formal instruction cannot be found. Claim absorbed upward.',
    'Package performance visible only in weekly meetings — by which time delays are already claims.',
  ],
  after: [
    'Every instruction formally issued in BaytyAI. Scope, date, and issuer recorded. Variation recovered.',
    'Approval delay tracked from submission date. EOT evidence built automatically as delay accumulates.',
    'Subcontractor instructions formal and documented. Every variation has an instruction trail. Claim defended.',
    'Package performance visible in real time. Problems identified before they become formal notices.',
  ],
  closingHeading: 'You do the work. You should be paid for it.',
  closingSub:
    'BaytyAI gives Tier-1 contractors the commercial control layer to manage packages, document every instruction, and protect every claim — from award to final account.',
};

export default function ContractorAudiencePage() {
  return <AudienceDetail data={data} />;
}
