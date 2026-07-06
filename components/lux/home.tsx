import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Building2,
  CheckSquare,
  ClipboardCheck,
  Clock,
  FileText,
  FileX,
  GitBranch,
  Globe,
  HardHat,
  Layers,
  Package,
  ShieldCheck,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';

import { LuxShell } from '@/components/lux/chrome';
import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';
import StitchHighRiseShader from '@/components/sections/stitch-high-rise-shader';

import type { LucideIcon } from 'lucide-react';

/* ── data ─────────────────────────────────────────────────────────── */

const TRUST = [
  'Verified organisations only',
  'Full decision audit trail',
  'Bilingual EN / AR',
  'Enterprise-grade security',
];

const COSTS: { figure: string; body: string; icon: LucideIcon }[] = [
  {
    figure: '$3.2M',
    body: 'Average commercial exposure from undocumented variation orders on a $500M construction program.',
    icon: AlertTriangle,
  },
  {
    figure: '23 days',
    body: 'Average approval delay when workflows cross five parties without a single governed system. One day of delay on a major program costs $50,000–$500,000.',
    icon: Clock,
  },
  {
    figure: '68%',
    body: 'Of mega-project disputes involve documentation failures — missing approvals, version conflicts, or unsigned handover records.',
    icon: FileX,
  },
];

const ROLES: {
  icon: LucideIcon;
  title: string;
  pain: string;
  cta: string;
  href: string;
}[] = [
  {
    icon: Building2,
    title: 'Client / Owner',
    pain: 'You approved a budget. Someone else spent it differently.',
    cta: 'See your command center',
    href: '/audiences/client',
  },
  {
    icon: ClipboardCheck,
    title: 'Consultant',
    pain: 'Your review is on record. The decision it triggered is not.',
    cta: 'See your workspace',
    href: '/audiences/consultant',
  },
  {
    icon: HardHat,
    title: 'Contractor',
    pain: 'You managed the package. The claim came from a decision you never made.',
    cta: 'See your control layer',
    href: '/audiences/contractor',
  },
  {
    icon: Wrench,
    title: 'Subcontractor',
    pain: 'You did the work. The scope changed without a written instruction.',
    cta: 'See your protection',
    href: '/audiences/subcontractor',
  },
  {
    icon: Package,
    title: 'Supplier',
    pain: 'You quoted it. They awarded it to someone else. You were never told why.',
    cta: 'See your position',
    href: '/audiences/supplier',
  },
];

const STEPS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Verify every party',
    body: 'Every organisation joins the program through a verified onboarding process. No unverified participant can access sensitive workflows.',
  },
  {
    icon: GitBranch,
    title: 'Map authority',
    body: 'Owners define who approves what, in what sequence, with what permissions. Authority is explicit, not assumed.',
  },
  {
    icon: Layers,
    title: 'Control the workflow',
    body: 'Approvals, documents, RFQs, awards, claims, and variations move through one governed system — with a decision trail that is legally defensible.',
  },
  {
    icon: BarChart2,
    title: 'See the risk',
    body: 'AI surfaces delayed approvals, missing evidence, claims exposure, and scope drift to program leadership — before they become disputes.',
  },
];

const CAPABILITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: FileText,
    title: 'Document Control',
    body: 'Version history, decision records, and audit-ready evidence. One current version. No ambiguity.',
  },
  {
    icon: AlertTriangle,
    title: 'Claims Intelligence',
    body: 'AI connects decisions, documents, scope changes, and approval history into a defensible commercial timeline.',
  },
  {
    icon: CheckSquare,
    title: 'Approval Governance',
    body: 'Authority matrix workflows for drawings, RFIs, payment certificates, and variation orders.',
  },
  {
    icon: Users,
    title: 'Stakeholder Verification',
    body: 'Organisations verified before they access sensitive project workflows. Role-based permissions enforced.',
  },
  {
    icon: TrendingUp,
    title: 'Risk Intelligence',
    body: 'Delayed approvals, missing evidence, and claims exposure surfaced to leadership before they escalate.',
  },
  {
    icon: Globe,
    title: 'Multilingual Delivery',
    body: 'Bilingual EN/AR workflows for international delivery teams and regional program environments.',
  },
];

const SECTORS = [
  'Mixed-use developments',
  'Airports & transport',
  'Government capital programs',
  'Hospitality & destination',
  'Industrial & energy',
  'Smart city & urban',
];

/* ── shared bits ──────────────────────────────────────────────────── */

function Overline({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`font-dmmono text-[11px] uppercase tracking-[0.28em] ${dark ? 'text-gold' : 'text-gold'}`}
    >
      {children}
    </p>
  );
}

/* ── page ─────────────────────────────────────────────────────────── */

export default function HomeLux() {
  return (
    <LuxShell>
      {/* ── SECTION 1 — HERO ── */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-[76px]">
        <StitchHighRiseShader className="absolute inset-0 size-full opacity-65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(45,212,191,0.12),transparent_34%),linear-gradient(90deg,rgba(10,19,38,0.98)_0%,rgba(10,19,38,0.84)_48%,rgba(10,19,38,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy to-transparent" />

        <div className="relative mx-auto w-full max-w-container px-6 py-24 md:px-10">
          <Stagger className="flex flex-col">
            <StaggerItem>
              <Overline>Verified Project Control</Overline>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-8 max-w-[820px] font-cormorant text-[clamp(2.1rem,8vw,5rem)] font-light leading-[1.05] tracking-[-0.01em] text-offwhite">
                Mega-projects don&apos;t fail because of bad plans. They fail because nobody
                controls
                <span className="text-gold"> what happens after the plan.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 max-w-[620px] font-dmsans text-lg font-light leading-relaxed text-offwhite/65 md:text-xl">
                BaytyAI gives governments, developers, consultants, contractors, and suppliers one
                verified system of record for approvals, documents, risk, claims, and delivery
                governance — across every party, every package, every decision.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/access"
                  aria-label="Request enterprise access to BaytyAI"
                  className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Request Enterprise Access <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#cost"
                  aria-label="See how BaytyAI works"
                  className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  See how it works ↓
                </a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-14 flex flex-wrap items-center gap-x-5 gap-y-3">
                {TRUST.map((t, i) => (
                  <span key={t} className="flex items-center gap-5">
                    {i > 0 && <span className="hidden h-3 w-px bg-gold/40 sm:block" aria-hidden />}
                    <span className="font-dmmono text-[10px] uppercase tracking-[0.16em] text-offwhite/50">
                      {t}
                    </span>
                  </span>
                ))}
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 2 — THE REAL COST ── */}
      <section id="cost" className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-slateink">
              The Cost of the Status Quo
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[52px]">
              On every mega-project, the same failures happen. And they are always expensive.
            </h2>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
            {COSTS.map(({ figure, body, icon: Icon }) => (
              <StaggerItem key={figure}>
                <div
                  className="h-full border-[0.5px] border-gold/30 bg-navy p-9"
                  style={{ borderRadius: 2 }}
                >
                  <Icon className="size-6 text-gold" strokeWidth={1.25} aria-hidden />
                  <p className="mt-6 font-cormorant text-5xl font-light text-gold">{figure}</p>
                  <p className="mt-4 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/70">
                    {body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeUp delay={0.1}>
            <p className="mx-auto mt-16 max-w-2xl text-center font-cormorant text-2xl font-light italic text-navy">
              BaytyAI exists because the cost of not having it is too high to ignore.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 3 — ROLE SELECTOR ── */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline>Your Role on the Program</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[56px]">
              Every party on the program. One governed system.
            </h2>
            <p className="mt-5 max-w-xl font-dmsans text-lg font-light text-offwhite/60">
              Select your role to see exactly what BaytyAI gives you.
            </p>
          </FadeUp>
          <Stagger className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {ROLES.map(({ icon: Icon, title, pain, cta, href }) => (
              <StaggerItem key={href}>
                <Link
                  href={href}
                  aria-label={`BaytyAI for ${title} — ${cta}`}
                  className="group flex h-full flex-col border-[0.5px] border-gold/25 bg-navy-card p-7 transition-[border-color,border-width] duration-300 hover:border hover:border-gold"
                  style={{ borderRadius: 2 }}
                >
                  <Icon className="size-7 text-gold" strokeWidth={1.25} aria-hidden />
                  <h3 className="mt-6 font-dmsans text-xl font-medium text-offwhite">{title}</h3>
                  <p className="mt-3 flex-1 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/60">
                    {pain}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 font-dmmono text-[11px] uppercase tracking-[0.14em] text-gold">
                    {cta}
                    <ArrowRight
                      className="size-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 4 — HOW IT WORKS ── */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-slateink">
              How It Works
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[52px]">
              From fragmented delivery to controlled execution. In four steps.
            </h2>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden border-[0.5px] border-navy/15 md:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, body }, i) => (
              <StaggerItem key={title} className="bg-offwhite p-8">
                <div className="flex items-center gap-3">
                  <Icon className="size-6 text-navy" strokeWidth={1.25} aria-hidden />
                  <span className="font-dmmono text-[11px] tracking-[0.2em] text-slateink">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-6 font-cormorant text-2xl font-medium text-navy">{title}</h3>
                <p className="mt-3 font-dmsans text-[15px] font-light leading-relaxed text-slateink">
                  {body}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 5 — CAPABILITY GRID ── */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline>The Platform</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[52px]">
              One command center. Every critical function.
            </h2>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map(({ icon: Icon, title, body }) => (
              <StaggerItem key={title}>
                <div
                  className="h-full border-[0.5px] border-gold/25 bg-navy-card p-8 transition-colors duration-300 hover:border-gold/50"
                  style={{ borderRadius: 2 }}
                >
                  <Icon className="size-6 text-gold" strokeWidth={1.25} aria-hidden />
                  <h3 className="mt-6 font-dmsans text-lg font-medium text-offwhite">{title}</h3>
                  <p className="mt-3 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/60">
                    {body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 6 — SECTOR COVERAGE ── */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-12 px-6 md:grid-cols-2 md:px-10">
          <FadeUp>
            <h2 className="max-w-md font-cormorant text-3xl font-semibold leading-[1.12] text-navy md:text-[44px]">
              Built for the sectors where delivery failure is not an option.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-wrap content-start gap-3">
            {SECTORS.map((s) => (
              <span
                key={s}
                className="rounded-full border-[0.5px] border-navy/40 px-5 py-2.5 font-dmmono text-[12px] tracking-[0.06em] text-navy"
              >
                {s}
              </span>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 7 — FINAL CTA ── */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 text-center md:px-10">
          <FadeUp>
            <h2 className="mx-auto max-w-4xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[68px]">
              The programs that cannot afford to fail deserve a system built for them.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-dmsans text-lg font-light text-offwhite/65">
              BaytyAI is available by enterprise invitation. Request access to begin the onboarding
              conversation.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/access"
                aria-label="Request enterprise access to BaytyAI"
                className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Request Enterprise Access <ArrowRight className="size-4" aria-hidden />
              </Link>
              <a
                href="mailto:enterprise@baytyai.com"
                aria-label="Email the BaytyAI enterprise team"
                className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                enterprise@baytyai.com
              </a>
            </div>
          </FadeUp>
        </div>
      </section>
    </LuxShell>
  );
}
