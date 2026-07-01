import Link from 'next/link';

import Logo, { LogoMark } from '@/components/brand/logo';
import Reveal from '@/components/motion/Reveal';
import A1RoleJourneys from '@/components/sections/a1-role-journeys';

/**
 * A1 — premium, investor-grade light landing page for BaytyAI.
 * Bayty-Blue brand palette, Playfair display headings, soft elevation.
 */

const STAKEHOLDERS = [
  {
    role: 'Clients & Owners',
    gain: 'Post inquiries, compare verified quotations, award with a full audit trail.',
  },
  {
    role: 'Consultants',
    gain: 'Win mandates through a transparent, weighted selection — not who-you-know.',
  },
  { role: 'Contractors', gain: 'Bid on structured scopes and manage approvals in one place.' },
  {
    role: 'Subcontractors',
    gain: 'Get discovered by verified main contractors, gated by approval.',
  },
  { role: 'Suppliers', gain: 'Quote against real demand from verified buyers worldwide.' },
];

const STEPS = [
  {
    n: '01',
    t: 'Get verified',
    d: 'Every organization is manually verified before it can transact — trust by default.',
  },
  {
    n: '02',
    t: 'Post or discover',
    d: 'Publish an inquiry or browse open demand, filtered by region, budget and scope.',
  },
  {
    n: '03',
    t: 'Quote & evaluate',
    d: 'Receive quotations and score them on weighted, version-locked criteria.',
  },
  {
    n: '04',
    t: 'Award & track',
    d: 'Award with an explainable recommendation and an exportable record.',
  },
];

const METRICS = [
  { v: '6', l: 'Verified stakeholder roles' },
  { v: '100%', l: 'Auditable decisions' },
  { v: '∞', l: 'Global reach — every market' },
  { v: '0', l: 'Black-box outcomes' },
];

const NAV = [
  { label: 'How it works', href: '#how' },
  { label: 'About', href: '/about' },
  { label: 'Sign in', href: '/login' },
];

export default function A1Landing() {
  return (
    <main className="bg-white text-steel-900">
      {/* ───────────── Light header ───────────── */}
      <header className="sticky top-0 z-50 border-b border-steel-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-6 md:px-12">
          <Link href="/" aria-label="BaytyAI home">
            <Logo size={30} />
          </Link>
          <nav className="flex items-center gap-7" aria-label="Primary">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hidden font-sans text-sm font-medium text-steel-600 transition-colors hover:text-bayty-600 sm:inline"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/sign-up"
              className="rounded-pill bg-bayty-500 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-bayty-600"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      {/* ───────────── Hero ───────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-bayty-50 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-32 -top-32 h-[460px] w-[460px] rounded-full bg-bayty-100/60 blur-3xl"
        />
        <div className="mx-auto max-w-container px-6 pb-24 pt-28 md:px-12 md:pt-36">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill border border-bayty-200 bg-white px-3 py-1 font-sans text-xs font-medium text-bayty-600 shadow-a1-sm">
                <span className="size-1.5 rounded-full bg-forest-400" /> Global verified marketplace
              </span>
              <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.07] tracking-tight text-steel-900 md:text-[3.6rem]">
                The verified network for{' '}
                <span className="text-bayty-500">construction & facilities</span> management.
              </h1>
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-steel-600">
                BaytyAI connects verified clients, consultants, contractors, subcontractors and
                suppliers worldwide — with structured inquiries, transparent quotations, weighted
                consultant selection, approvals and document control on one trusted platform.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/sign-up"
                  className="rounded-pill bg-orange-400 px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-a1-glow transition-colors hover:bg-orange-600"
                >
                  Request early access
                </Link>
                <Link
                  href="#how"
                  className="rounded-pill border border-steel-200 bg-white px-7 py-3.5 font-sans text-sm font-semibold text-steel-800 transition-colors hover:border-bayty-300 hover:text-bayty-600"
                >
                  See how it works
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6 font-sans text-sm text-steel-500">
                <span className="flex items-center gap-2">
                  <CheckIcon /> Manual verification
                </span>
                <span className="flex items-center gap-2">
                  <CheckIcon /> Full audit trail
                </span>
                <span className="flex items-center gap-2">
                  <CheckIcon /> Worldwide
                </span>
              </div>
            </div>

            {/* Hero visual — verified network card */}
            <Reveal className="relative">
              <div className="relative mx-auto max-w-md rounded-card border border-steel-200 bg-white p-8 shadow-a1-lg">
                <div className="flex items-center justify-between">
                  <Logo size={30} />
                  <span className="rounded-pill bg-forest-50 px-2.5 py-1 font-sans text-[11px] font-semibold text-forest-600">
                    Verified
                  </span>
                </div>
                <div className="my-8 flex justify-center">
                  <div className="flex size-40 items-center justify-center rounded-full bg-gradient-to-br from-bayty-50 to-bayty-100 shadow-inner">
                    <LogoMark size={92} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  {[
                    'Client',
                    'Consultant',
                    'Contractor',
                    'Subcontractor',
                    'Supplier',
                    'Platform',
                  ].map((r) => (
                    <span
                      key={r}
                      className="rounded-card bg-steel-50 p-2 font-sans text-[11px] font-medium text-steel-600"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ───────────── Metrics band ───────────── */}
      <section className="border-y border-steel-200 bg-steel-50">
        <div className="mx-auto grid max-w-container grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-12">
          {METRICS.map((m) => (
            <div key={m.l} className="text-center">
              <p className="font-display text-4xl font-bold text-bayty-500">{m.v}</p>
              <p className="mt-2 font-sans text-sm text-steel-500">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ───────────── Role journeys (animated "is this for me?") ───────────── */}
      <A1RoleJourneys />

      {/* ───────────── Stakeholders ───────────── */}
      <section className="mx-auto max-w-container px-6 py-24 md:px-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-bayty-500">
              One platform · six roles
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-steel-900">
              Built for every party in the project
            </h2>
            <p className="mt-4 font-sans text-lg text-steel-600">
              Each stakeholder gets a purpose-built, permissioned experience — verified, structured
              and fair.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STAKEHOLDERS.map((s) => (
            <Reveal key={s.role}>
              <div className="group h-full rounded-card border border-steel-200 bg-white p-7 shadow-a1-sm transition-shadow hover:shadow-a1-md">
                <div className="mb-4 flex size-11 items-center justify-center rounded-card bg-bayty-50 text-bayty-500">
                  <LogoMark size={24} />
                </div>
                <h3 className="font-sans text-lg font-semibold text-steel-900">{s.role}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-steel-600">{s.gain}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ───────────── How it works ───────────── */}
      <section id="how" className="bg-steel-50 py-24">
        <div className="mx-auto max-w-container px-6 md:px-12">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-bayty-500">
                How it works
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold text-steel-900">
                From inquiry to award — transparently
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {STEPS.map((s) => (
              <Reveal key={s.n}>
                <div className="h-full rounded-card border border-steel-200 bg-white p-7 shadow-a1-sm">
                  <span className="font-display text-3xl font-bold text-bayty-200">{s.n}</span>
                  <h3 className="mt-3 font-sans text-base font-semibold text-steel-900">{s.t}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-steel-600">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────── Investor CTA ───────────── */}
      <section className="relative overflow-hidden bg-bayty-500">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-24 bottom-0 size-80 rounded-full bg-bayty-400/40 blur-3xl"
        />
        <div className="relative mx-auto max-w-container px-6 py-24 text-center md:px-12">
          <div className="mx-auto mb-6 flex justify-center">
            <Logo tone="light" size={40} />
          </div>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            The trust layer for a fragmented, trillion-dollar industry.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-lg text-bayty-100">
            Verification, structured procurement and explainable selection — the rails global
            construction & facilities management has been missing. Join us early.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/sign-up"
              className="rounded-pill bg-white px-7 py-3.5 font-sans text-sm font-semibold text-bayty-600 shadow-a1-md transition-transform hover:-translate-y-0.5"
            >
              Request early access
            </Link>
            <Link
              href="/about"
              className="rounded-pill border border-white/30 px-7 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Learn about the brand
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────── Light footer ───────────── */}
      <footer className="border-t border-steel-200 bg-white">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row md:px-12">
          <Logo size={26} />
          <p className="font-sans text-sm text-steel-500">
            Global verified marketplace for construction &amp; facilities management.
          </p>
          <nav className="flex gap-6 font-sans text-sm text-steel-500" aria-label="Footer">
            <Link href="/about" className="hover:text-bayty-600">
              About
            </Link>
            <Link href="/terms" className="hover:text-bayty-600">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-bayty-600">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#f0fdf4" />
      <path
        d="M4.5 8.2 7 10.5 11.5 5.5"
        stroke="#2e7d32"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
