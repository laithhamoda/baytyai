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
        className="mb-6 inline-block font-mono text-[11px] uppercase tracking-widest text-steel-500 transition-colors hover:text-bayty-600"
      >
        ← Back to marketplace
      </Link>

      <header className="mb-6">
        <div className="mb-2 flex flex-wrap gap-2">
          {inquiry.region && (
            <span className="border border-steel-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-steel-500">
              {inquiry.region}
            </span>
          )}
          {inquiry.budgetBand && (
            <span className="border border-steel-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-steel-500">
              {inquiry.budgetBand}
            </span>
          )}
        </div>
        <h1 className="font-sans text-2xl font-semibold text-steel-900">{inquiry.title}</h1>
        <p className="mt-3 whitespace-pre-line font-sans text-sm leading-relaxed text-steel-600">
          {inquiry.description || 'No description provided.'}
        </p>
      </header>

      <InquiryDetailClient inquiry={inquiry} canQuote={verified} />
    </div>
  );
}
