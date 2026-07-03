import Link from 'next/link';
import { Suspense } from 'react';

import Logo from '@/components/brand/logo';

import AccessForm from './access-form';

export const metadata = {
  title: { absolute: 'Request Access — BaytyAI' },
  description:
    'BaytyAI is granted by invitation to verified organizations on the world’s mega projects. Request access for your organization.',
  alternates: { canonical: 'https://www.baytyai.com/access' },
};

export default function AccessPage() {
  return (
    <main className="min-h-screen bg-steel-50 px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <Link href="/" aria-label="BaytyAI home" className="mb-8">
            <Logo size={34} />
          </Link>
          <span className="rounded-pill border border-bayty-200 bg-white px-3 py-1 font-sans text-xs font-medium text-bayty-600 shadow-a1-sm">
            By invitation · Verified organizations only
          </span>
          <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-steel-900">
            Request access for your organization
          </h1>
          <p className="mt-4 max-w-xl font-sans text-base leading-relaxed text-steel-600">
            BaytyAI is the operating system for the world’s mega projects. Tell us about your
            organization — our team reviews every application manually and invites qualifying
            governments, developers, consultants, contractors and suppliers.
          </p>
        </div>

        <div className="rounded-card border border-steel-200 bg-white p-6 shadow-a1-sm md:p-8">
          <Suspense fallback={null}>
            <AccessForm />
          </Suspense>
        </div>

        <p className="mt-6 text-center font-sans text-sm text-steel-500">
          Already invited?{' '}
          <Link href="/login" className="text-bayty-600 underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
