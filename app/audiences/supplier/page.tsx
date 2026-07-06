import {
  BarChart2,
  CheckSquare,
  Clock,
  CreditCard,
  FileText,
  Package,
  Scale,
  Search,
  Shield,
} from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Suppliers | Verified Procurement, Transparent Awards, Reliable Payment',
  description:
    'BaytyAI gives strategic suppliers access to structured procurement demand, transparent award processes, and payment tracking on verified mega-project programs — so your commercial relationships are formal, fair, and documented.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/supplier' },
};

const data: AudienceDetailData = {
  slug: 'supplier',
  breadcrumb: 'Supplier',
  headline: {
    plain: 'You quoted it. They awarded it to someone else.',
    gold: 'You were never told why.',
  },
  sub: 'Suppliers invest weeks in quotation preparation for programs they cannot see into, compete for awards through processes with no transparency, and deliver on credit to contractors whose payment track record they had no way to verify. BaytyAI is the platform where procurement is structured, awards are documented, and suppliers know exactly where they stand.',
  ctaLabel: 'Request supplier access',
  painOverline: 'What Opaque Procurement Costs You',
  painHeading: 'The commercial reality of opaque procurement.',
  pains: [
    {
      icon: Search,
      title: 'Quotation effort with no visibility into the outcome',
      body: "You prepared a detailed technical and commercial submission. It took four weeks and significant engineering resource. The award went elsewhere. The reason given: 'commercial decision.' Your team will never know if the price was wrong, the specification missed a requirement, or the award was predetermined. The next RFQ arrives. The cycle repeats.",
      cost: 'Suppliers spend an average of 8–12% of annual revenue on unsuccessful tender preparation',
    },
    {
      icon: Scale,
      title: 'Competing in processes you cannot verify are fair',
      body: "Without a governed procurement system, you have no way to know whether the evaluation criteria you bid against are the criteria the award was made on. Informal procurement protects the contractor's flexibility. It costs you your commercial credibility.",
      cost: '40% of supplier commercial disputes arise from award decisions that cannot be evidenced',
    },
    {
      icon: Clock,
      title: 'Delivering on credit with no payment visibility',
      body: "You delivered materials on the agreed programme. The contractor's payment certificate process is opaque. Your invoice is 'in the system.' Your account manager cannot get a status update. 60 days past due, you are still waiting — and your cashflow cannot absorb another cycle.",
      cost: 'Average supplier payment delay on mega-projects: 53 days beyond contractual terms',
    },
  ],
  ccOverline: 'Your Position',
  ccHeading: 'Structured procurement. Transparent awards. Payment you can track.',
  ccSub:
    'BaytyAI gives suppliers access to verified mega-project demand through a structured procurement process where evaluation criteria are documented, award decisions are transparent, and payment milestones are tracked in real time.',
  capabilities: [
    {
      icon: Package,
      title: 'Structured RFQ participation',
      body: "Receive formal RFQs through BaytyAI's procurement workflow. Every RFQ includes verified scope, specification, evaluation criteria, and submission deadline — no ambiguity about what you are quoting against.",
    },
    {
      icon: CheckSquare,
      title: 'Transparent evaluation process',
      body: 'Submissions are evaluated against documented criteria within the platform. You receive formal notification of the award outcome — and the documented reason for the decision.',
    },
    {
      icon: FileText,
      title: 'Formal award documentation',
      body: 'When you win, the award is formally documented with scope, commercial value, delivery programme, and terms — before you mobilise a single unit.',
    },
    {
      icon: CreditCard,
      title: 'Payment milestone visibility',
      body: "Every delivery milestone has a formal submission, a review SLA, and a payment due date. You see exactly where your payment is in the contractor's approval process — in real time.",
    },
    {
      icon: Shield,
      title: 'Verified program participation',
      body: 'BaytyAI programs run on verified participation. The contractors you supply through BaytyAI are verified, governed, and commercially accountable in a way informal relationships are not.',
    },
    {
      icon: BarChart2,
      title: 'Commercial relationship history',
      body: 'Your delivery performance, quality records, and commercial history build on BaytyAI — creating a verified track record that makes you more competitive on every subsequent program.',
    },
  ],
  before: [
    "RFQ received with incomplete specification. Quoted blind. Award went to a competitor. Reason: 'commercial.'",
    'Award made verbally. Scope confirmed by email. Dispute arises: what was actually agreed?',
    'Delivery complete. Invoice submitted. Payment status: unknown. Account manager: not responding.',
    'Program ends. Your commercial contribution is not formally recognised. Next bid: same risk.',
  ],
  after: [
    'RFQ received with verified scope and documented evaluation criteria. Submission made. Decision documented and communicated with reasons.',
    'Award formally issued with scope, value, programme, and terms before mobilisation.',
    'Payment certificate logged. Review SLA tracked. Overdue certificate triggers escalation. Payment status: visible.',
    'Program ends. Your delivery record, quality history, and commercial performance documented. Next bid: stronger position.',
  ],
  closingHeading:
    'Procurement should be structured. Awards should be transparent. Payment should be on time.',
  closingSub: 'BaytyAI gives suppliers access to mega-project programs where all three are true.',
};

export default function SupplierAudiencePage() {
  return <AudienceDetail data={data} />;
}
