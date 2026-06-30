import Link from 'next/link';
import { notFound } from 'next/navigation';

import { getInquiryDetail } from '@/app/actions/marketplace/browse';
import { getMyVerification } from '@/app/actions/verification/request';

import InquiryDetailClient from './detail-client';

export const metadata = {
  title: { absolute: 'Inquiry — BaytyAI' },
};

export default async function InquiryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [result, verification] = await Promise.all([getInquiryDetail(id), getMyVerification()]);
  if (!result.success) notFound();

  const inquiry = result.data;
  const verified = verification.success && verification.data.status === 'verified';

  return (
    <div className="mx-auto max-w-3xl p-2">
      <Link
        href="/dashboard/marketplace"
        className="mb-6 inline-block font-mono text-[11px] uppercase tracking-widest text-ink-500 transition-colors hover:text-signal-500"
      >
        ← Back to marketplace
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap gap-2">
          {inquiry.region && (
            <span className="text-ink-400 border border-ink-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              {inquiry.region}
            </span>
          )}
          {inquiry.budgetBand && (
            <span className="text-ink-400 border border-ink-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest">
              {inquiry.budgetBand}
            </span>
          )}
        </div>
        <h1 className="font-sans text-2xl font-semibold text-ink-100">{inquiry.title}</h1>
        <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-ink-300">
          {inquiry.description || 'No description provided.'}
        </p>
      </header>

      <InquiryDetailClient inquiry={inquiry} canQuote={verified} />
    </div>
  );
}
