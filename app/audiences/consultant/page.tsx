import {
  AlertTriangle,
  FileCheck,
  GitBranch,
  GitMerge,
  History,
  Scale,
  Shield,
  Users,
} from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Lead Consultants | Governed Review Authority and Evidence Control',
  description:
    'BaytyAI gives consultants a verified, audit-ready workspace for RFIs, submittals, reviews, decisions, and evidence trails — so your professional authority is always documented and never disputed.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/consultant' },
};

const data: AudienceDetailData = {
  slug: 'consultant',
  breadcrumb: 'Consultant',
  headline: { plain: 'Your review is on record.', gold: 'The decision it triggered is not.' },
  sub: 'When a contractor acts on your verbal instruction and something goes wrong, the dispute is not about what happened. It is about what can be proved. BaytyAI ensures that every review, every decision, and every direction you issue has a documented, timestamped, version-controlled record — before the contractor acts on it.',
  ctaLabel: 'Request consultant access',
  painOverline: 'What Authority Without Evidence Costs You',
  painHeading: 'The risk of carrying authority without evidence.',
  pains: [
    {
      icon: Scale,
      title: 'Your professional indemnity follows every undocumented decision',
      body: 'When a contractor claims Extension of Time for your late review, they are building a case from dates you never tracked. When a defect claim traces to your approval, the question is not whether you approved it — it is whether you can prove what you approved, and when, and based on what information.',
      cost: 'PI claims from undocumented consultancy decisions average $2M–$18M per program',
    },
    {
      icon: GitMerge,
      title: 'Version confusion costs you your credibility',
      body: 'You reviewed Drawing Revision 4. The contractor built from Revision 3. The question in the dispute is not who is right — it is who can prove which revision was current at the time of instruction. Without version-controlled document control, that question has no clean answer.',
      cost: '42% of construction disputes involve document version conflicts',
    },
    {
      icon: Users,
      title: 'Coordinating a multi-discipline review team across email creates gaps',
      body: "Your structural review, your MEP team's comments, and your project manager's approval are in three different email chains. When the contractor needs a consolidated response, someone summarises verbally. What was said and what was recorded are different things.",
      cost: 'Fragmented review coordination adds 11–17 days to average RFI resolution times',
    },
  ],
  ccOverline: 'Your Workspace',
  ccHeading: 'Your professional authority — documented at the moment it is exercised.',
  ccSub:
    'BaytyAI gives consultants a governed workspace where every RFI, submittal, review, and decision is recorded, attributed, and version-controlled before it has any effect.',
  capabilities: [
    {
      icon: FileCheck,
      title: 'Formal RFI and submittal management',
      body: 'Every request is logged with originator, issue date, required response date, and your documented response. No verbal acknowledgements. No informal closures.',
    },
    {
      icon: GitBranch,
      title: 'Multi-discipline review coordination',
      body: 'Route reviews to structural, MEP, architecture, and project management simultaneously. Consolidated response generated from individual comments — with full contributor attribution.',
    },
    {
      icon: History,
      title: 'Version-controlled document authority',
      body: 'You review the current revision. The system records which revision was current when you reviewed it. Revision disputes have a definitive answer.',
    },
    {
      icon: Scale,
      title: 'Legally defensible decision records',
      body: 'Every decision you make carries your identity, your timestamp, the supporting documentation, and the version on which it was based. Your evidence is built at the moment of action, not reconstructed after the fact.',
    },
    {
      icon: AlertTriangle,
      title: 'Overdue review alerts',
      body: 'BaytyAI flags reviews approaching SLA breach before they become contractor claims. You see the risk when you can still act on it.',
    },
    {
      icon: Shield,
      title: 'Professional indemnity protection by design',
      body: 'The complete, timestamped record of every review and decision is your PI defence — organised, accessible, and legally structured, without any additional effort from your team.',
    },
  ],
  before: [
    'Contractor claims your review was late. Your records show emails — they show messages.',
    'Document dispute: they built from Revision 3. Your approval was of Revision 4. No system confirms which was current.',
    'PI claim filed. Your defence depends on email threads your IT team has to reconstruct.',
    'Review coordination tracked in a shared spreadsheet last updated three weeks ago.',
  ],
  after: [
    'Every review has a logged issue date, SLA, response date, and your documented response. The claim has no basis.',
    'Revision control is absolute. The system shows exactly which revision was current when you approved it.',
    'PI defence is your BaytyAI record: timestamped, attributed, version-controlled, exported in minutes.',
    'Multi-discipline reviews consolidated in one system. Every contributor identified. Every comment traceable.',
  ],
  closingHeading: 'Your authority is only as strong as its evidence.',
  closingSub:
    'BaytyAI gives consultants the governed workspace to exercise review authority with confidence — knowing every decision is documented before it has any effect.',
};

export default function ConsultantAudiencePage() {
  return <AudienceDetail data={data} />;
}
