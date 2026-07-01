import Link from 'next/link';

import Logo from '@/components/brand/logo';

export const metadata = {
  title: { absolute: 'Request Access — BaytyAI' },
  description:
    'BaytyAI is granted by invitation to verified organizations on the world’s mega projects. Request access for your organization.',
  alternates: { canonical: 'https://www.baytyai.com/access' },
};

export default function AccessPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-steel-50 px-6 py-24 text-center">
      <Link href="/" aria-label="BaytyAI home" className="mb-10">
        <Logo size={34} />
      </Link>
      <span className="rounded-pill border border-bayty-200 bg-white px-3 py-1 font-sans text-xs font-medium text-bayty-600 shadow-a1-sm">
        By invitation · Verified organizations only
      </span>
      <h1 className="mt-6 max-w-2xl font-display text-4xl font-bold leading-tight text-steel-900 md:text-5xl">
        Request access for your organization
      </h1>
      <p className="mt-5 max-w-xl font-sans text-lg leading-relaxed text-steel-600">
        BaytyAI is the operating system for the world’s mega projects. Access is granted to verified
        governments, mega-developers, lead consultants, tier-1 contractors and strategic suppliers.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          href="/login"
          className="rounded-pill bg-orange-400 px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-a1-glow transition-colors hover:bg-orange-600"
        >
          Continue
        </Link>
        <Link
          href="/"
          className="rounded-pill border border-steel-200 bg-white px-7 py-3.5 font-sans text-sm font-semibold text-steel-800 transition-colors hover:border-bayty-300 hover:text-bayty-600"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
