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
      <div className="flex min-h-screen items-center justify-center bg-steel-50 px-6 text-center">
        <div className="max-w-[420px]">
          <h1 className="mb-4 font-sans text-3xl font-semibold text-steel-900">Not authorised</h1>
          <p className="mb-7 font-sans text-sm leading-relaxed text-steel-600">
            Your account ({user.email}) does not have admin access.
          </p>
          <Link
            href="/"
            className="font-sans text-sm text-bayty-600 transition-colors hover:text-steel-900"
          >
            Return to site →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-steel-50 text-steel-900">
      <header className="border-b border-steel-200 px-6 py-5 md:px-8">
        <div className="mx-auto flex max-w-container items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              href="/admin"
              className="font-sans text-lg font-semibold tracking-tight text-steel-900"
            >
              Bayty<span className="text-bayty-600">AI</span> Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-steel-500 transition-colors hover:text-bayty-600"
              >
                Content
              </Link>
              <Link
                href="/admin/approvals"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-steel-500 transition-colors hover:text-bayty-600"
              >
                Approvals
              </Link>
              <Link
                href="/admin/verifications"
                className="font-mono text-[10px] uppercase tracking-[0.15em] text-steel-500 transition-colors hover:text-bayty-600"
              >
                Verifications
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-5">
            <span className="hidden font-sans text-sm text-steel-600 sm:inline">{user.email}</span>
            <Link
              href="/"
              className="font-sans text-xs text-steel-500 transition-colors hover:text-bayty-600"
            >
              View site ↗
            </Link>
            <form action={signOutUser}>
              <button
                type="submit"
                className="border border-bayty-500 px-4 py-2 font-sans text-xs uppercase tracking-[0.08em] text-bayty-600 transition-colors hover:bg-bayty-600 hover:text-white"
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
