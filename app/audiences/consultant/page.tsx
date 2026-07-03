import { ShieldCheck, FileClock, PenLine, GitBranch, Radar, BadgeCheck } from 'lucide-react';

import AudiencePage, { type AudienceContent } from '@/components/lux/audience-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Consultants | Protect Your Liability with Defensible Decisions',
  description:
    'BaytyAI gives engineering and PM consultants an audit-ready record of every instruction, approval, and recommendation — so your professional judgment is always defensible.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/consultant' },
};

const content: AudienceContent = {
  eyebrow: 'For the Consultant',
  headline: (
    <>
      Your professional judgment is only as safe as
      <span className="text-gold"> your ability to prove it.</span>
    </>
  ),
  lede: 'Two years after you issued the instruction, a claim lands and everyone remembers it differently. The email is buried, the markup is unsigned, the approval is verbal. Your seal is on the drawing — and the exposure is on you.',
  costs: [
    {
      figure: 'Years',
      label:
        'How long after a decision a claim can surface — long after the paper trail has scattered.',
    },
    {
      figure: 'Personal',
      label: 'Professional indemnity attaches to your name and your firm, not to the project.',
    },
    {
      figure: 'One email',
      label:
        'The single unrecoverable message that decides who is liable for a seven-figure dispute.',
    },
  ],
  shift: {
    heading: 'From defending your memory to presenting the record.',
    paragraphs: [
      'Every instruction you issue, every submittal you review, every recommendation you make becomes a versioned, timestamped, attributable record the moment it happens — not something to reconstruct under pressure years later.',
      'When a dispute comes, you do not argue about what was said. You produce exactly what was decided, by whom, on what date, on what basis. Your judgment stops being a liability you defend and becomes a record that defends you.',
    ],
  },
  outcomesHeading: 'Advise with authority. Sleep at night.',
  outcomes: [
    {
      icon: FileClock,
      title: 'Every instruction, on the record',
      body: 'Instructions, RFIs, and approvals are captured with author, timestamp, and version — a complete chain, not scattered emails.',
    },
    {
      icon: PenLine,
      title: 'No more verbal approvals',
      body: 'Decisions route through a controlled workflow. Nothing of consequence happens on a phone call no one can produce later.',
    },
    {
      icon: ShieldCheck,
      title: 'Liability you can evidence',
      body: 'When PI is on the line, show precisely what you recommended and when — the difference between exposure and vindication.',
    },
    {
      icon: GitBranch,
      title: 'Controlled document flow',
      body: 'Transmittals, revisions, and superseded issues are governed automatically, so no party builds from the wrong drawing on your watch.',
    },
    {
      icon: Radar,
      title: 'Early risk intelligence',
      body: 'AI flags the contradictions, delays, and claim patterns forming across the correspondence you supervise — before they become your problem.',
    },
    {
      icon: BadgeCheck,
      title: 'Verified counterparties',
      body: 'You advise on a program where every contractor and supplier is verified, so your recommendations rest on parties who are who they claim to be.',
    },
  ],
  closing: 'Make every decision one you can defend.',
};

export default function ConsultantAudiencePage() {
  return <AudiencePage slug="consultant" content={content} />;
}
