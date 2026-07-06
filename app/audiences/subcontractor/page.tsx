import {
  AlertTriangle,
  CreditCard,
  FileCheck,
  FileX,
  GitBranch,
  History,
  MessageSquare,
  Shield,
} from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Subcontractors | Formal Instructions, Documented Variations, Secure Payments',
  description:
    'BaytyAI gives subcontractors formal written instructions for every scope change, a documented variation trail that cannot be disputed, and payment records protected from day one.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/subcontractor' },
};

const data: AudienceDetailData = {
  slug: 'subcontractor',
  breadcrumb: 'Subcontractor',
  headline: {
    plain: 'The scope changed.',
    gold: 'The instruction never came in writing.',
  },
  sub: 'On every mega-project, subcontractors perform work they were told to do — verbally, informally, on-site — and then cannot recover the cost when the contract says only written instructions count. BaytyAI ensures that every instruction you receive is formally issued, every variation is documented, and every payment milestone is protected before you lift a tool.',
  ctaLabel: 'Request subcontractor access',
  painOverline: 'What Working Without a Formal Instruction Costs You',
  painHeading: 'The cost of performing work without a formal instruction.',
  pains: [
    {
      icon: FileX,
      title: 'Additional work performed. Formal order never issued.',
      body: 'Your site supervisor received a verbal instruction to extend the scope. You mobilised additional labour and materials. At payment, the contractor says the instruction was never formally issued and refuses to pay for work that was genuinely performed. You have WhatsApp messages. They have a contract clause.',
      cost: 'Subcontractors lose an average of 22% of variation costs when instructions are informal',
    },
    {
      icon: AlertTriangle,
      title: 'Scope disputes you cannot defend',
      body: 'The original scope was 450sqm of MEP installation. You installed 510sqm on instruction from the site manager. The final account shows 450sqm. You cannot prove the additional 60sqm was instructed — because the instruction was verbal and the site manager no longer works for the contractor.',
      cost: '67% of subcontractor payment disputes involve scope performed beyond the written contract',
    },
    {
      icon: CreditCard,
      title: 'Payment delays with no recourse',
      body: "The milestone is complete. Your payment certificate was submitted three weeks ago. The contractor's response: 'under review.' Without a governed payment process with escalation rights, 'under review' can mean anything, for any length of time.",
      cost: 'Average subcontractor payment delay on mega-projects: 47 days beyond contractual terms',
    },
  ],
  ccOverline: 'Your Protection',
  ccHeading: 'Formal instructions. Documented variations. Payments on record.',
  ccSub:
    'BaytyAI gives subcontractors the governed workspace they need to receive formal instructions, document every variation, and track every payment milestone — so nothing you perform is informal and nothing you are owed can be disputed.',
  capabilities: [
    {
      icon: FileCheck,
      title: 'Formal written instructions only',
      body: "Every scope instruction you receive on BaytyAI is formally issued in writing — with the issuer's identity, date, scope description, and your acknowledgement. Verbal instructions have no place in a BaytyAI-governed program.",
    },
    {
      icon: GitBranch,
      title: 'Variation documentation at point of instruction',
      body: 'When additional scope is instructed, the variation is formally raised at the moment of instruction — not reconstructed at final account. The record is built when it matters.',
    },
    {
      icon: CreditCard,
      title: 'Milestone payment tracking',
      body: 'Every payment milestone has a submission date, a review SLA, and a payment due date. Overdue reviews escalate automatically. You see exactly where your payment is in the process.',
    },
    {
      icon: History,
      title: 'Complete instruction history',
      body: 'Every instruction you have received, every variation you have performed, and every response you have given is stored in your project record — chronologically, attributably, and permanently.',
    },
    {
      icon: Shield,
      title: 'Formal dispute evidence',
      body: 'When a payment is disputed, your BaytyAI record shows the instruction, the date, the scope, and the acknowledgement — in a format that is legally structured and export-ready.',
    },
    {
      icon: MessageSquare,
      title: 'Direct formal communication',
      body: 'Communications with the main contractor through BaytyAI are formal and recorded. No ambiguity about what was agreed, what was directed, or what was acknowledged.',
    },
  ],
  before: [
    'Verbal instruction received. Work performed. Payment disputed. WhatsApp messages not contractually valid.',
    'Additional scope completed. No variation order raised. Final account does not include it.',
    "Payment certificate submitted. Status: 'under review.' No escalation path. No visibility.",
    'Dispute arises. Your evidence is a mix of emails, texts, and verbal accounts that contradict each other.',
  ],
  after: [
    'Every instruction formally issued. Every instruction formally acknowledged. Payment basis is unambiguous.',
    'Variation raised at point of instruction. Scope, date, issuer, and your acknowledgement all on record.',
    'Payment certificate logged with submission date and SLA. Overdue review triggers automatic escalation.',
    'Dispute arises. Your BaytyAI record is a timestamped, attributed, export-ready evidence file.',
  ],
  closingHeading: 'You do the work. The instruction should be in writing.',
  closingSub:
    'BaytyAI gives subcontractors formal written instructions for every scope change, a documented variation trail, and payment visibility that protects what you are owed.',
};

export default function SubcontractorAudiencePage() {
  return <AudienceDetail data={data} />;
}
