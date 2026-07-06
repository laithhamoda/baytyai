import Link from 'next/link';

import Logo, { LogoMark } from '@/components/brand/logo';
import Reveal from '@/components/motion/Reveal';
import A1RoleJourneys from '@/components/sections/a1-role-journeys';
import StitchHighRiseShader from '@/components/sections/stitch-high-rise-shader';

const OBSIDIAN = '#020305';

const STAKEHOLDERS = [
  {
    role: 'Governments & Authorities',
    gain: 'Control verified participation, approvals, audit records, and governance across public capital programs.',
  },
  {
    role: 'Owners & Mega-Developers',
    gain: 'See project risk, delayed approvals, document status, claims exposure, and contractor accountability in one place.',
  },
  {
    role: 'Lead Consultants',
    gain: 'Manage reviews, submittals, RFIs, decisions, and evidence trails with clear authority and version control.',
  },
  {
    role: 'Tier-1 Contractors',
    gain: 'Coordinate packages, suppliers, subcontractors, variations, quotations, and approval dependencies.',
  },
  {
    role: 'Strategic Suppliers',
    gain: 'Quote against structured demand and participate in verified, transparent procurement workflows.',
  },
];

const STEPS = [
  {
    n: '01',
    t: 'Verify every party',
    d: 'Organizations are verified before sensitive project workflows are enabled.',
  },
  {
    n: '02',
    t: 'Map authority',
    d: 'Owners define roles, permissions, approval paths, and decision rights.',
  },
  {
    n: '03',
    t: 'Control the workflow',
    d: 'Approvals, documents, RFQs, awards, claims, and variations move through one governed system.',
  },
  {
    n: '04',
    t: 'Escalate risk',
    d: 'Leadership sees delayed approvals, missing evidence, claims exposure, and package-level project health.',
  },
];

const METRICS = [
  { v: '1', l: 'Verified project command center' },
  { v: '6', l: 'Core stakeholder groups' },
  { v: '100%', l: 'Audit-ready decisions' },
  { v: '24/7', l: 'Enterprise visibility' },
];

const NAV = [
  { label: 'Mega Projects', href: '/mega-projects' },
  { label: 'Security', href: '/security' },
  { label: 'Resources', href: '/resources' },
];

export default function A1Landing() {
  return (
    <main className="text-white" style={{ backgroundColor: OBSIDIAN }}>
      <header
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur-xl"
        style={{ backgroundColor: 'rgba(2,3,5,0.82)' }}
      >
        <div className="mx-auto flex h-16 max-w-container items-center justify-between px-6 md:px-12">
          <Link href="/" aria-label="BaytyAI home">
            <Logo tone="light" size={30} />
          </Link>
          <nav className="flex items-center gap-7" aria-label="Primary">
            {NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="hidden font-sans text-sm font-medium text-white/70 transition-colors hover:text-white sm:inline"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/access"
              className="rounded-sm bg-[#e9c176] px-5 py-2.5 font-sans text-sm font-semibold text-[#261900] shadow-[0_0_24px_rgba(233,193,118,0.18)] transition-colors hover:bg-[#ffdea5]"
            >
              Request access
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden border-b border-white/10">
        <StitchHighRiseShader className="absolute inset-0 size-full opacity-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.16),transparent_34%),linear-gradient(90deg,rgba(2,3,5,0.98)_0%,rgba(2,3,5,0.72)_48%,rgba(2,3,5,0.12)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020305] to-transparent" />

        <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-container items-center px-6 py-24 md:px-12 md:py-28">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-sm border border-[#e9c176]/20 bg-[#0b0f1a]/60 px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-[#e9c176] backdrop-blur-xl">
                <span className="size-1.5 rounded-full bg-[#3cddc7] shadow-[0_0_14px_rgba(60,221,199,0.75)]" />
                Elite AI Construction + FM Operating System
              </span>
              <h1 className="mt-7 max-w-3xl font-display text-[3rem] font-semibold leading-[1.03] text-white md:text-[5.4rem]">
                The enterprise command center for{' '}
                <span className="bg-gradient-to-b from-white to-[#aeb3c4] bg-clip-text text-transparent">
                  global construction intelligence.
                </span>
              </h1>
              <p className="mt-6 max-w-2xl font-sans text-lg leading-relaxed text-[#c6c6cb] md:text-xl">
                BaytyAI unifies mega-project management, construction ERP, facilities management,
                asset governance, claims, approvals, compliance, and AI risk intelligence for
                owners, contractors, consultants, and FM operators delivering high-value programs
                worldwide.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/access"
                  className="rounded-sm bg-[#e9c176] px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-[#261900] shadow-[0_0_32px_rgba(233,193,118,0.22)] transition-colors hover:bg-[#ffdea5]"
                >
                  Request Enterprise Access
                </Link>
                <Link
                  href="/mega-projects"
                  className="rounded-sm border border-white/20 bg-white/5 px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white backdrop-blur transition-colors hover:bg-white/10"
                >
                  Explore Platform
                </Link>
              </div>
              <div className="mt-12 grid max-w-2xl grid-cols-1 border border-white/10 bg-[#0b0f1a]/55 backdrop-blur-xl sm:grid-cols-3">
                {[
                  ['AI ERP', 'Project control'],
                  ['FM OS', 'Asset operations'],
                  ['Audit', 'Governance layer'],
                ].map(([label, value]) => (
                  <div key={label} className="border-white/10 p-5 sm:border-r sm:last:border-r-0">
                    <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#3cddc7]">
                      {label}
                    </p>
                    <p className="mt-2 font-sans text-sm text-white/70">{value}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0b0f1a]">
        <div className="mx-auto grid max-w-container grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-12">
          {METRICS.map((m) => (
            <div key={m.l} className="text-center">
              <p className="font-display text-4xl font-bold text-[#e9c176]">{m.v}</p>
              <p className="mt-2 font-sans text-sm text-white/60">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      <A1RoleJourneys />

      <section className="mx-auto max-w-container px-6 py-24 md:px-12">
        <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest text-[#6fe0c2]">
              One command center
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold text-white">
              Built for every party on the program
            </h2>
            <p className="mt-4 font-sans text-lg text-white/70">
              Each stakeholder gets a permissioned workspace while leadership keeps one trusted
              source of project-control truth.
            </p>
          </div>
        </Reveal>
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {STAKEHOLDERS.map((s) => (
            <Reveal key={s.role}>
              <div className="group h-full border border-white/10 bg-white/5 p-7 transition-colors hover:border-white/20">
                <div className="mb-4 flex size-11 items-center justify-center bg-white/10">
                  <LogoMark size={24} tone="light" />
                </div>
                <h3 className="font-sans text-lg font-semibold text-white">{s.role}</h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-white/65">{s.gain}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="how" className="border-y border-white/10 bg-white/[0.03] py-24">
        <div className="mx-auto max-w-container px-6 md:px-12">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-sans text-sm font-semibold uppercase tracking-widest text-[#6fe0c2]">
                How it works
              </p>
              <h2 className="mt-3 font-display text-4xl font-bold text-white">
                From fragmented delivery to controlled execution
              </h2>
            </div>
          </Reveal>
          <div className="mt-14 grid gap-5 md:grid-cols-4">
            {STEPS.map((s) => (
              <Reveal key={s.n}>
                <div className="h-full border border-white/10 bg-white/5 p-7">
                  <span className="font-display text-3xl font-bold text-white/25">{s.n}</span>
                  <h3 className="mt-3 font-sans text-base font-semibold text-white">{s.t}</h3>
                  <p className="mt-2 font-sans text-sm leading-relaxed text-white/65">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative">
        <div className="relative mx-auto max-w-container px-6 py-24 text-center md:px-12">
          <div className="mx-auto mb-6 flex justify-center">
            <Logo tone="light" size={40} />
          </div>
          <h2 className="mx-auto max-w-3xl font-display text-4xl font-bold leading-tight text-white md:text-5xl">
            The verified trust layer for global construction and infrastructure delivery.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl font-sans text-lg text-white/70">
            Project control, compliance, stakeholder verification, and AI risk intelligence for the
            programs where delays, claims, and undocumented decisions are too expensive to ignore.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link
              href="/access"
              className="rounded-pill bg-orange-400 px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-a1-glow transition-transform hover:-translate-y-0.5"
            >
              Request access
            </Link>
            <Link
              href="/implementation"
              className="rounded-pill border border-white/25 px-7 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              See implementation model
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row md:px-12">
          <Logo tone="light" size={26} />
          <p className="font-sans text-sm text-white/55">
            AI project control infrastructure for global mega projects.
          </p>
          <nav className="flex gap-6 font-sans text-sm text-white/55" aria-label="Footer">
            <Link href="/mega-projects" className="hover:text-white">
              Mega Projects
            </Link>
            <Link href="/security" className="hover:text-white">
              Security
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}
