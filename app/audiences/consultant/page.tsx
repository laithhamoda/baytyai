import { FileClock, GitBranch, PenLine, Radar, ScrollText, ShieldOff, Users } from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Consultants | Defensible Decisions, Protected Liability',
  description:
    'BaytyAI gives engineering and PM consultants an audit-ready record of every instruction, review, and approval — so professional judgment is always attributable, defensible, and protected.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/consultant' },
};

const data: AudienceDetailData = {
  slug: 'consultant',
  breadcrumb: 'Consultant',
  headline: { plain: 'Your judgment is on the record.', gold: 'The decision it triggered is not.' },
  sub: 'You issue instructions, review submittals, and certify progress every day — and years later a claim asks you to prove exactly what you decided and why. When the record is scattered across emails and verbal calls, your seal carries the exposure. BaytyAI makes every decision you make attributable the moment it happens.',
  ctaLabel: 'Request consultant access',
  painOverline: 'What an Informal Record Costs You',
  painHeading: 'The liability you carry when the paper trail is thin.',
  pains: [
    {
      icon: ShieldOff,
      title: 'Professional indemnity exposure',
      body: 'A claim surfaces two years after the instruction. The email is buried, the markup is unsigned, the approval was verbal. Professional indemnity attaches to your firm and your name — not to the project — and you are asked to defend a decision you can no longer fully evidence.',
      cost: 'PI claims routinely run $2M–$5M and attach to your firm, not the program',
    },
    {
      icon: PenLine,
      title: 'Verbal approvals you cannot produce',
      body: 'The instruction was given on a call. The change went ahead. When the dispute comes, the single message that decides who is liable cannot be found — and an undocumented approval is indistinguishable from no approval at all.',
      cost: 'One unrecoverable email can decide a seven-figure dispute',
    },
    {
      icon: FileClock,
      title: 'Work built from superseded drawings',
      body: 'A contractor builds from a revision you had already superseded. Without governed transmittals and version control, the error traces back to the party responsible for issuing the current information — you.',
      cost: '68% of mega-project disputes cite documentation or version failures',
    },
  ],
  ccOverline: 'Your Workspace',
  ccHeading: 'Every decision, captured the moment you make it.',
  ccSub:
    'BaytyAI turns your professional judgment from a liability you defend into a record that defends you — attributable, timestamped, and version-controlled across every instruction, review, and approval.',
  capabilities: [
    {
      icon: FileClock,
      title: 'Every instruction on the record',
      body: 'Instructions, RFIs, and approvals are captured with author, timestamp, and version — a complete chain, not scattered emails to reconstruct under pressure.',
    },
    {
      icon: PenLine,
      title: 'No more verbal approvals',
      body: 'Decisions route through a controlled workflow. Nothing of consequence happens on a phone call no one can produce later.',
    },
    {
      icon: GitBranch,
      title: 'Controlled document flow',
      body: 'Transmittals, revisions, and superseded issues are governed automatically, so no party builds from the wrong drawing on your watch.',
    },
    {
      icon: ScrollText,
      title: 'Audit-ready evidence',
      body: 'When professional indemnity is on the line, show precisely what you recommended and when — the difference between exposure and vindication.',
    },
    {
      icon: Radar,
      title: 'Early risk intelligence',
      body: 'AI flags the contradictions, delays, and claim patterns forming across the correspondence you supervise — before they become your problem.',
    },
    {
      icon: Users,
      title: 'Verified counterparties',
      body: 'Every contractor and supplier you advise on is verified, so your recommendations rest on parties who are who they claim to be.',
    },
  ],
  before: [
    'Instructions issued by email, phone, and site conversation — no single record',
    'Approvals given verbally, impossible to produce when a claim arrives',
    'Contractors building from whichever revision they happened to hold',
    'PI defence assembled reactively, years later, from fragmented evidence',
  ],
  after: [
    'Every instruction attributable, timestamped, and versioned as it is issued',
    'Approvals captured through a controlled workflow — always producible',
    'Governed transmittals ensure every party holds the current information',
    'A complete evidence trail already assembled the day a dispute begins',
  ],
  closingHeading: 'Advise with authority. Defend with evidence.',
  closingSub:
    'BaytyAI is available by enterprise invitation to consultants on major programs. Request access to begin the conversation.',
};

export default function ConsultantAudiencePage() {
  return <AudienceDetail data={data} />;
}
