import Link from 'next/link';

import { listPublishedInquiries } from '@/app/actions/marketplace/browse';
import { getMyVerification } from '@/app/actions/verification/request';

import MarketplaceClient from './marketplace-client';

export const metadata = {
  title: { absolute: 'Marketplace — BaytyAI' },
};

export default async function MarketplacePage() {
  const [listResult, verification] = await Promise.all([
    listPublishedInquiries(),
    getMyVerification(),
  ]);
  const initial = listResult.success ? listResult.data : [];
  const verified = verification.success && verification.data.status === 'verified';

  return (
    <div className="mx-auto max-w-5xl p-2">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">
            Marketplace
          </p>
          <h1 className="font-sans text-3xl font-semibold text-steel-900">Open inquiries</h1>
          <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-steel-600">
            Browse published inquiries and submit quotations. Only verified organizations can post
            inquiries or quote.
          </p>
        </div>
        <Link
          href="/dashboard/marketplace/new"
          className="rounded-pill bg-bayty-500 px-5 py-2.5 font-mono text-[11px] uppercase tracking-widest text-white"
        >
          Post an inquiry
        </Link>
      </header>

      {!verified && (
        <p className="mb-6 border border-bayty-500/40 bg-steel-50 px-4 py-3 font-sans text-sm text-steel-600">
          Your organization isn’t verified yet, so posting and quoting are disabled.{' '}
          <Link href="/dashboard/verification" className="text-bayty-600 underline">
            Request verification
          </Link>
          .
        </p>
      )}

      <MarketplaceClient initial={initial} canQuote={verified} />
    </div>
  );
}
