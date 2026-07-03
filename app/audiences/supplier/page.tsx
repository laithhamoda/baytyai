import {
  BadgeCheck,
  Banknote,
  FileCheck2,
  PackageCheck,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

import AudienceDetail, { type AudienceDetailData } from '@/components/lux/audience-detail';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Suppliers | Verified Status That Wins You the Next Award',
  description:
    'BaytyAI turns suppliers into verified, preferred vendors on $1B+ programs — with proof of delivery, linked compliance, and faster payment on every purchase order.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/supplier' },
};

const data: AudienceDetailData = {
  slug: 'supplier',
  breadcrumb: 'Supplier',
  headline: {
    plain: 'You delivered on time.',
    gold: 'The dispute over the paperwork is costing you the next order.',
  },
  sub: 'The materials arrived, but the delivery note is contested, the compliance certificate is buried in an inbox, and the invoice is held. On a mega-project, one messy transaction does not just delay your payment — it quietly removes you from the shortlist for the next award. BaytyAI makes every transaction clean, verified, and impossible to dispute.',
  ctaLabel: 'Request supplier access',
  painOverline: 'What a Messy Transaction Costs You',
  painHeading: 'The repeat business you lose to a filing gap.',
  pains: [
    {
      icon: Banknote,
      title: 'Invoices held on missing evidence',
      body: 'Your invoice sits unpaid because the delivery evidence and compliance documents are not linked and verified against the purchase order. Clean goods, delivered on time, held hostage by a filing gap.',
      cost: 'Invoices held for weeks when delivery and compliance are not linked',
    },
    {
      icon: PackageCheck,
      title: 'Delisting from the next award',
      body: 'A program under pressure remembers which suppliers created work. One contested delivery or late certificate is enough to quietly drop you from the shortlist for the next package.',
      cost: 'One messy transaction can remove you from the next shortlist',
    },
    {
      icon: FileCheck2,
      title: 'Re-proving yourself on every job',
      body: 'Your credentials and compliance are verified from scratch on each new package, because nothing portable follows you. Your reliability never compounds into an advantage.',
      cost: '68% of mega-project disputes cite documentation or verification failures',
    },
  ],
  ccOverline: 'Your Position',
  ccHeading: 'The vendor a mega-project calls first.',
  ccSub:
    'BaytyAI verifies and links every delivery, certificate, and compliance document to the purchase order the moment it is issued — a clean transaction record that clears faster and a verified status that travels with you to the next program.',
  capabilities: [
    {
      icon: BadgeCheck,
      title: 'Verified vendor status',
      body: 'Identity, credentials, and compliance are verified once and trusted across the program — a mark that opens doors to the next award.',
    },
    {
      icon: PackageCheck,
      title: 'Proof of delivery',
      body: 'Delivery notes and receipts are captured and linked to the PO, so what you shipped is never in question.',
    },
    {
      icon: FileCheck2,
      title: 'Compliance, always current',
      body: 'Certificates, test reports, and approvals live against each order — no more invoices held for a missing document.',
    },
    {
      icon: Banknote,
      title: 'Faster payment',
      body: 'A clean, linked transaction record clears procurement and finance faster, so your cash is not hostage to a filing gap.',
    },
    {
      icon: ShieldCheck,
      title: 'Fewer disputes',
      body: 'When every document is verified and connected, there is nothing left to argue about — and nothing to hold your money.',
    },
    {
      icon: TrendingUp,
      title: 'A record that wins repeat work',
      body: 'Your reliability is evidenced, not claimed — the reputation that puts you at the top of the list on the next program.',
    },
  ],
  before: [
    'Delivery notes and certificates scattered, unlinked to the purchase order',
    'Invoices held while procurement hunts for missing evidence',
    'Compliance re-proven from scratch on every new package',
    'A clean track record that never follows you to the next award',
  ],
  after: [
    'Every delivery and certificate verified and linked to the PO on issue',
    'Invoices cleared faster on a complete, undisputed transaction record',
    'Verified status carried across the program and the next one',
    'An evidenced reputation that puts you first on the shortlist',
  ],
  closingHeading: 'Turn one clean delivery into a decade of orders.',
  closingSub:
    'BaytyAI is available by enterprise invitation to suppliers on major programs. Request access to begin the conversation.',
};

export default function SupplierAudiencePage() {
  return <AudienceDetail data={data} />;
}
