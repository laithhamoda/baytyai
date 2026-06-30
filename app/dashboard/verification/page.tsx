import { getMyVerification } from '@/app/actions/verification/request';

import VerificationClient from './verification-client';

export const metadata = {
  title: { absolute: 'Verification — BaytyAI' },
};

export default async function VerificationPage() {
  const result = await getMyVerification();
  const state = result.success
    ? result.data
    : { status: 'unverified' as const, requestedAt: null, verifiedAt: null, notes: null };

  return (
    <div className="mx-auto max-w-2xl p-2">
      <header className="mb-8">
        <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-500">
          Trust &amp; access
        </p>
        <h1 className="font-sans text-3xl font-semibold text-ink-100">Organization verification</h1>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-300">
          Verification is reviewed and granted manually by the BaytyAI team. Only verified
          organizations can post inquiries and submit quotations in the marketplace.
        </p>
      </header>
      <VerificationClient initial={state} />
    </div>
  );
}
