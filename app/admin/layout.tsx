import Link from 'next/link';
import { redirect } from 'next/navigation';

import { getSessionUser } from '@/lib/supabase/auth';

import { signOutUser } from './actions';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Admin — BaytyAI' },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();

  // Not signed in → middleware already redirects, but guard here too.
  if (!user) redirect('/login?next=/admin');

  // Signed in but not an admin → explicit refusal, not a redirect loop.
  if (user.role !== 'admin') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 text-center">
        <div className="max-w-[420px]">
          <h1 className="mb-4 font-sans text-3xl font-semibold text-ink-100">Not authorised</h1>
          <p className="mb-7 font-sans text-sm leading-relaxed text-ink-300">
            Your account ({user.email}) does not have admin access.
          </p>
          <Link
            href="/"
            className="font-sans text-sm text-signal-500 transition-colors hover:text-ink-100"
          >
            Return to site →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 text-ink-100">
      <header className="border-b border-ink-700 px-6 py-5 md:px-8">
        <div className="mx-auto flex max-w-container items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="font-sans text-lg font-semibold tracking-tight text-ink-100"
            >
              Bayty<span className="text-signal-500">AI</span> Admin
            </Link>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-ink-500">
              Content
            </span>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden font-sans text-sm text-ink-300 sm:inline">{user.email}</span>
            <Link
              href="/"
              className="font-sans text-xs text-ink-500 transition-colors hover:text-signal-500"
            >
              View site ↗
            </Link>
            <form action={signOutUser}>
              <button
                type="submit"
                className="border border-signal-500 px-4 py-2 font-sans text-xs uppercase tracking-[0.08em] text-signal-500 transition-colors hover:bg-signal-500 hover:text-ink-950"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[900px] px-6 pb-32 pt-12 md:px-8">{children}</main>
    </div>
  );
}
