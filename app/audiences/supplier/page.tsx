import {
  BadgeCheck,
  PackageCheck,
  FileCheck2,
  Banknote,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';

import AudiencePage, { type AudienceContent } from '@/components/lux/audience-page';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'For Suppliers | Verified Status That Wins You the Next Award',
  description:
    'BaytyAI turns suppliers into verified, preferred vendors on $1B+ programs — with proof of delivery, clean documentation, and faster payment on every purchase order.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/supplier' },
};

const content: AudienceContent = {
  eyebrow: 'For the Supplier',
  headline: (
    <>
      You delivered on time. The dispute over the paperwork
      <span className="text-gold"> is costing you the next order.</span>
    </>
  ),
  lede: 'The materials arrived, but the delivery note is contested, the compliance certificate is buried in an inbox, and the invoice is held. On a mega-project, one messy transaction does not just delay your payment — it quietly removes you from the shortlist for the next award.',
  costs: [
    {
      figure: 'Held',
      label:
        'Where an invoice sits when delivery evidence and compliance documents are not linked and verified.',
    },
    {
      figure: 'Delisted',
      label:
        'What happens to a supplier whose paperwork creates work for a program under pressure.',
    },
    {
      figure: 'Repeat',
      label: 'The business you lose when a clean record does not follow you to the next package.',
    },
  ],
  shift: {
    heading: 'From chasing purchase orders to being the vendor they call first.',
    paragraphs: [
      'Every delivery, certificate, and compliance document is verified and linked to the purchase order the moment it is issued — a clean, complete transaction record that leaves nothing to dispute.',
      'Your verified status travels with you across the program and the next one. You stop being a vendor that has to re-prove itself on every job and become the preferred supplier whose reliability is already on the record.',
    ],
  },
  outcomesHeading: 'Become the supplier a mega-project trusts.',
  outcomes: [
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
  closing: 'Turn one clean delivery into a decade of orders.',
};

export default function SupplierAudiencePage() {
  return <AudiencePage slug="supplier" content={content} />;
}
