import Link from 'next/link';

import Logo, { LogoMark } from '@/components/brand/logo';
import Reveal from '@/components/motion/Reveal';
import A1RoleJourneys from '@/components/sections/a1-role-journeys';

const NAVY = '#17284a';

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
    <main className="text-white" style={{ backgroundColor: NAVY }}>
      <header
        className="sticky top-0 z-50 border-b border-white/10 backdrop-blur"
        style={{ backgroundColor: 'rgba(23,40,74,0.92)' }}
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
              className="rounded-pill bg-orange-400 px-5 py-2.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Request access
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        <div className="mx-auto max-w-container px-6 py-24 md:px-12 md:pt-32">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-pill border border-white/20 bg-white/5 px-3 py-1 font-sans text-xs font-medium text-bayty-100">
                <span className="size-1.5 rounded-full bg-[#6fe0c2]" /> Enterprise AI for global
                mega projects
              </span>
              <h1 className="mt-6 font-display text-[2.7rem] font-bold leading-[1.07] text-white md:text-[3.6rem]">
                AI project control for the world&apos;s{' '}
                <span className="text-[#6fe0c2]">mega projects</span>.
              </h1>
              <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-white/75">
                BaytyAI gives governments, mega-developers, consultants, contractors, and suppliers
                one verified command center for approvals, documents, claims, variations, risks,
                compliance, and audit-ready decisions.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/access"
                  className="rounded-pill bg-orange-400 px-7 py-3.5 font-sans text-sm font-semibold text-white shadow-a1-glow transition-colors hover:bg-orange-600"
                >
                  Request enterprise access
                </Link>
                <Link
                  href="/mega-projects"
                  className="rounded-pill border border-white/25 bg-white/5 px-7 py-3.5 font-sans text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Explore mega-project control
                </Link>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 font-sans text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <Dot /> Verified organizations only
                </span>
                <span className="flex items-center gap-2">
                  <Dot /> Full decision audit trail
                </span>
                <span className="flex items-center gap-2">
                  <Dot /> Bilingual English and Arabic workflows
                </span>
              </div>
            </div>

            <Reveal className="relative">
              <div className="relative mx-auto max-w-md border border-white/10 bg-white/5 p-8 shadow-a1-lg backdrop-blur">
                <div className="flex items-center justify-between">
                  <Logo tone="light" size={30} />
                  <span className="rounded-pill bg-[#2f7d64]/20 px-2.5 py-1 font-sans text-[11px] font-semibold text-[#6fe0c2]">
                    Verified control
                  </span>
                </div>
                <div className="my-8 flex justify-center">
                  <div className="flex size-40 items-center justify-center rounded-full bg-white/5">
                    <LogoMark size={92} tone="light" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-3">
                  {['Owner', 'Authority', 'Consultant', 'Contractor', 'Supplier', 'Platform'].map(
                    (r) => (
                      <span
                        key={r}
                        className="bg-white/5 p-2 font-sans text-[11px] font-medium text-white/70"
                      >
                        {r}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-container grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4 md:px-12">
          {METRICS.map((m) => (
            <div key={m.l} className="text-center">
              <p className="font-display text-4xl font-bold text-[#6fe0c2]">{m.v}</p>
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

function Dot() {
  return <span className="size-1.5 rounded-full bg-[#6fe0c2]" aria-hidden />;
}
