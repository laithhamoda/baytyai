import Link from 'next/link';

import { getMyVerification } from '@/app/actions/verification/request';

import NewInquiryClient from './new-inquiry-client';

export const metadata = {
  title: { absolute: 'Post an inquiry — BaytyAI' },
};

export default async function NewInquiryPage() {
  const verification = await getMyVerification();
  const verified = verification.success && verification.data.status === 'verified';

  return (
    <div className="mx-auto max-w-2xl p-2">
      <Link
        href="/dashboard/marketplace"
        className="mb-6 inline-block font-mono text-[11px] uppercase tracking-widest text-steel-500 transition-colors hover:text-bayty-600"
      >
        ← Back to marketplace
      </Link>
      <h1 className="mb-2 font-sans text-2xl font-semibold text-steel-900">Post an inquiry</h1>
      <p className="mb-8 font-sans text-sm text-steel-600">
        Describe what you need. Verified organizations can browse it and submit quotations.
      </p>

      {!verified ? (
        <p className="border border-bayty-500/40 bg-steel-50 px-4 py-3 font-sans text-sm text-steel-600">
          Your organization must be verified to post an inquiry.{' '}
          <Link href="/dashboard/verification" className="text-bayty-600 underline">
            Request verification
          </Link>
          .
        </p>
      ) : (
        <NewInquiryClient />
      )}
    </div>
  );
}
