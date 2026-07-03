import {
  AlertTriangle,
  ArrowRight,
  Eye,
  FileText,
  FileX,
  GitBranch,
  Globe,
  ShieldCheck,
  ShieldOff,
  X,
  Check,
} from 'lucide-react';
import Link from 'next/link';

import { LuxShell } from '@/components/lux/chrome';
import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';

import type { LucideIcon } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'BaytyAI for Owners & Clients | Executive Control Across Every Mega-Project',
  description:
    'BaytyAI gives program owners and client authorities one verified command center for approvals, decisions, risk exposure, contractor accountability, and delivery governance — across every package and every party.',
  alternates: { canonical: 'https://www.baytyai.com/audiences/client' },
};

/* ── data ─────────────────────────────────────────────────────────── */

const PAINS: { icon: LucideIcon; title: string; body: string; cost: string }[] = [
  {
    icon: AlertTriangle,
    title: 'Variation exposure you did not authorise',
    body: 'On a $1B program, undocumented scope changes from informal instructions average $45M in disputed variation orders. Without a governed approval trail, your commercial team cannot defend a single rejection.',
    cost: '$45M average disputed variation exposure per $1B program',
  },
  {
    icon: FileX,
    title: 'Approval delays that become claims',
    body: "When your consultant's review is late, your contractor submits an Extension of Time. When your approval is undocumented, you cannot contest it. Every day of unresolved approval is a liability building in silence.",
    cost: '1 day of delay on a major package = $50K–$500K in contractor claims exposure',
  },
  {
    icon: ShieldOff,
    title: 'Unverified contractors on your program',
    body: "When an unverified subcontractor performs defective work that causes harm, the liability traces back to the party that allowed them onto the program. 'We didn't know' is not a defence when proper verification was possible.",
    cost: '68% of mega-project disputes cite documentation or verification failures',
  },
];

const CAPABILITIES: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Eye,
    title: 'Executive dashboard',
    body: 'Approved vs. actual across all packages. Open approvals by age. Claims exposure. Contractor performance. Visible to leadership without manual reporting.',
  },
  {
    icon: ShieldCheck,
    title: 'Verified participants only',
    body: "Every contractor, consultant, subcontractor, and supplier is verified before they access your program's workflows. You know who is on your program and you can prove it.",
  },
  {
    icon: GitBranch,
    title: 'Controlled approval chains',
    body: 'Every drawing, RFI, payment certificate, and variation order moves through a defined authority matrix. No undocumented oral approvals. No scope changes without a signed record.',
  },
  {
    icon: FileText,
    title: 'Audit-ready evidence',
    body: 'Every decision has a timestamp, a responsible party, and supporting documentation. When a dispute arises, your evidence is already organised.',
  },
  {
    icon: AlertTriangle,
    title: 'Risk and claims intelligence',
    body: 'AI identifies delayed approvals, scope drift, and claims exposure before they become formal notices. You see problems when they are still problems, not when they are disputes.',
  },
  {
    icon: Globe,
    title: 'Full program visibility',
    body: 'Whether your program has 3 packages or 300, BaytyAI gives you one consistent view of delivery health — with the same governance layer applied across every team.',
  },
];

const BEFORE = [
  'Approval status reported in weekly meetings — by the people responsible for delays',
  'Variation orders discovered during final account, not when they happen',
  'No verified record of which organisations accessed which workflows',
  'Claims land with evidence you cannot counter because you never held it',
];

const AFTER = [
  'Approval status visible in real time — to leadership, not just the delivery team',
  'Every variation order documented, dated, and attributable the moment it arises',
  'Complete verified participation record — every party, every date, every access',
  'Claims met with a timestamped, role-attributed, version-controlled evidence trail',
];

/* ── page ─────────────────────────────────────────────────────────── */

export default function ClientAudiencePage() {
  return (
    <LuxShell>
      {/* ── SECTION 1 — HERO ── */}
      <section className="pt-[76px]">
        <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-36">
          <Stagger className="flex flex-col">
            <StaggerItem>
              <p className="font-dmmono text-[10px] uppercase tracking-[0.28em] text-gold">
                BaytyAI → Client / Owner
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-8 max-w-4xl font-cormorant text-[44px] font-light leading-[1.06] tracking-[-0.01em] text-offwhite md:text-[72px]">
                You funded the program.
                <span className="text-gold"> Someone else is making the decisions.</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 max-w-2xl font-dmsans text-lg font-light leading-relaxed text-offwhite/65 md:text-xl">
                On every mega-project, the gap between what leadership approved and what is actually
                happening on the ground widens silently — through undocumented decisions, unverified
                participants, and approval chains no one controls. BaytyAI closes that gap.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/access?role=client"
                  aria-label="Request client access to BaytyAI"
                  className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  Request client access <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#command-center"
                  aria-label="See the BaytyAI command center"
                  className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  See the command center <ArrowRight className="size-4" aria-hidden />
                </a>
              </div>
            </StaggerItem>
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 2 — THE PAIN, NAMED AND PRICED ── */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-slateink">
              What Uncontrolled Delivery Costs You
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[52px]">
              The risks you carry when governance is informal.
            </h2>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {PAINS.map(({ icon: Icon, title, body, cost }) => (
              <StaggerItem key={title}>
                <div
                  className="flex h-full flex-col border-[0.5px] border-gold/30 bg-navy p-8"
                  style={{ borderRadius: 2 }}
                >
                  <Icon className="size-6 text-gold" strokeWidth={1.25} aria-hidden />
                  <h3 className="mt-6 font-cormorant text-2xl font-normal text-offwhite">
                    {title}
                  </h3>
                  <p className="mt-4 flex-1 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/70">
                    {body}
                  </p>
                  <p className="mt-6 border-t border-gold/20 pt-5 font-dmmono text-[12px] uppercase leading-relaxed tracking-widest text-gold">
                    {cost}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ── SECTION 3 — THE COMMAND CENTER ── */}
      <section id="command-center" className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold">
              Your Command Center
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[52px]">
              One system. Total governance. Across every party and every package.
            </h2>
            <p className="mt-6 max-w-2xl font-dmsans text-lg font-light leading-relaxed text-offwhite/65">
              BaytyAI gives program leadership a single verified view of every approval, every risk,
              every contractor, and every decision — without depending on anyone to report to you.
            </p>
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

      {/* ── SECTION 4 — BEFORE / AFTER ── */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto grid w-full max-w-container grid-cols-1 gap-6 px-6 md:grid-cols-2 md:px-10">
          <FadeUp>
            <div
              className="h-full border-l-2 bg-white/40 p-8 md:p-10"
              style={{ borderLeftColor: '#7A1F1F', borderRadius: 2 }}
            >
              <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-[#7A1F1F]">
                Without BaytyAI
              </p>
              <ul className="mt-8 flex flex-col gap-6">
                {BEFORE.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <X
                      className="mt-0.5 size-5 shrink-0 text-[#7A1F1F]"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="font-dmsans text-[15px] font-light leading-relaxed text-slateink">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div
              className="h-full border-l-2 border-gold bg-navy p-8 md:p-10"
              style={{ borderRadius: 2 }}
            >
              <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold">
                With BaytyAI
              </p>
              <ul className="mt-8 flex flex-col gap-6">
                {AFTER.map((line) => (
                  <li key={line} className="flex items-start gap-3">
                    <Check
                      className="mt-0.5 size-5 shrink-0 text-gold"
                      strokeWidth={1.75}
                      aria-hidden
                    />
                    <span className="font-dmsans text-[15px] font-light leading-relaxed text-offwhite/80">
                      {line}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── SECTION 5 — CLOSING CTA ── */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 text-center md:px-10">
          <FadeUp>
            <h2 className="mx-auto max-w-3xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[56px]">
              You carry the risk. You should carry the control.
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-dmsans text-lg font-light text-offwhite/65">
              BaytyAI is available by enterprise invitation to program owners and client
              authorities. Request access to begin the implementation conversation.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href="/access?role=client"
                aria-label="Request client access to BaytyAI"
                className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                Request client access <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </LuxShell>
  );
}
