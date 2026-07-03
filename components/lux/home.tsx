import {
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Workflow,
  Radar,
  Gavel,
  Languages,
  Eye,
} from 'lucide-react';

import { LuxShell } from '@/components/lux/chrome';
import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';
import {
  Section,
  Overline,
  Display,
  Lede,
  GoldRule,
  PrimaryCTA,
  SecondaryCTA,
  LuxCard,
} from '@/components/lux/ui';

const CAPABILITIES = [
  {
    icon: ShieldCheck,
    title: 'Verified stakeholder onboarding',
    body: 'Every party — client, consultant, contractor, subcontractor, supplier — is identity-verified and credential-checked before they touch a document. Unverified access is not a risk you can afford.',
  },
  {
    icon: Radar,
    title: 'AI risk & claims intelligence',
    body: 'The platform reads your correspondence, variations, and delays and flags claim exposure weeks before it becomes a dispute — with the evidence trail already assembled.',
  },
  {
    icon: FileCheck2,
    title: 'Document control, audit-ready',
    body: 'Every revision, transmittal, and approval is versioned and timestamped. When an arbitrator asks who approved what, and when, the answer is one click — not one month.',
  },
  {
    icon: Workflow,
    title: 'Approval & authority matrix',
    body: 'Decisions route to the right authority in the right sequence. No approval is skipped, back-dated, or lost in an inbox. The chain of authority is enforced, not assumed.',
  },
  {
    icon: Gavel,
    title: 'RFQ, award & variation management',
    body: 'From tender to award to variation, every commercial decision is governed, competitive, and defensible — with a record that survives audit and litigation.',
  },
  {
    icon: Languages,
    title: 'Multilingual by design',
    body: 'Full English and Arabic across every workflow and document. Your program does not lose fidelity or authority in translation.',
  },
];

const COSTS = [
  {
    figure: '$500,000',
    label: 'The cost of a single approval delayed by one week on a $1B program.',
  },
  { figure: 'Voided', label: 'What one missing signed document does to a contract in dispute.' },
  {
    figure: 'Criminal',
    label: 'The liability an unverified contractor can create on a public project.',
  },
];

const AUDIENCES = [
  {
    label: 'Client / Owner',
    href: '/audiences/client',
    line: 'Total program visibility without waiting for a report.',
  },
  {
    label: 'Consultant',
    href: '/audiences/consultant',
    line: 'Defensible decisions, protected professional liability.',
  },
  {
    label: 'Contractor',
    href: '/audiences/contractor',
    line: 'Get paid faster; win every claim you are owed.',
  },
  {
    label: 'Subcontractor',
    href: '/audiences/subcontractor',
    line: 'Prove your work. Protect your cash flow.',
  },
  {
    label: 'Supplier',
    href: '/audiences/supplier',
    line: 'Verified status that wins you the next award.',
  },
];

export default function HomeLux() {
  return (
    <LuxShell>
      {/* Hero — lead with the pain */}
      <section className="relative overflow-hidden pt-[76px]">
        <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-40">
          <FadeUp>
            <Overline>By invitation · $1B+ programs · 40+ countries</Overline>
          </FadeUp>
          <FadeUp delay={0.08} className="mt-8 max-w-4xl">
            <Display as="h1" className="text-4xl md:text-6xl lg:text-[68px]">
              On a mega-project, the most expensive thing you own is a decision
              <span className="text-gold"> no one can trace.</span>
            </Display>
          </FadeUp>
          <FadeUp delay={0.16} className="mt-8 max-w-2xl">
            <Lede>
              BaytyAI is the verified governance and control layer for the world&apos;s most complex
              construction programs — where a delayed approval costs half a million dollars, a
              missing document voids a contract, and an unverified contractor becomes a criminal
              liability.
            </Lede>
          </FadeUp>
          <FadeUp delay={0.24} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <PrimaryCTA href="/access" ariaLabel="Request access to BaytyAI">
              Request Access <ArrowRight className="size-4" aria-hidden />
            </PrimaryCTA>
            <SecondaryCTA href="#how" ariaLabel="See how BaytyAI governs a program">
              See how it works
            </SecondaryCTA>
          </FadeUp>
        </div>
      </section>

      {/* The cost of chaos — make the pain expensive */}
      <Section id="how" className="border-t border-gold/15">
        <FadeUp>
          <Overline>What losing control actually costs</Overline>
          <Display className="mt-6 max-w-3xl text-3xl md:text-5xl">
            Every uncontrolled program leaks money in ways no one puts on the balance sheet — until
            it is too late.
          </Display>
        </FadeUp>
        <Stagger className="mt-16 grid grid-cols-1 gap-px overflow-hidden border-[0.5px] border-gold/20 md:grid-cols-3">
          {COSTS.map((c) => (
            <StaggerItem key={c.figure} className="bg-navy-card p-10">
              <p className="font-cormorant text-5xl font-light text-gold">{c.figure}</p>
              <GoldRule className="my-5" />
              <p className="font-dmsans text-base font-light leading-relaxed text-offwhite/70">
                {c.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* The shift — the inevitable solution */}
      <Section className="border-t border-gold/15">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <FadeUp className="md:col-span-5">
            <Overline>Not software. A shift.</Overline>
            <Display className="mt-6 text-3xl md:text-4xl">
              Stop managing your program. Start governing it.
            </Display>
          </FadeUp>
          <FadeUp delay={0.1} className="md:col-span-7">
            <p className="font-dmsans text-lg font-light leading-relaxed text-offwhite/75">
              A project management tool records what happened. A governance layer decides what is
              allowed to happen. BaytyAI verifies every party, enforces every authority, captures
              every decision as evidence, and puts the intelligence of AI on top of it all — so the
              people accountable for a $1B program finally operate with the control that
              accountability demands.
            </p>
            <p className="mt-6 font-dmsans text-lg font-light leading-relaxed text-offwhite/75">
              This is how the most serious owners, consultants, and contractors on earth intend to
              run the next decade of mega-projects. The only question is whether you lead that shift
              or answer for not making it.
            </p>
          </FadeUp>
        </div>
      </Section>

      {/* Capabilities */}
      <Section className="border-t border-gold/15">
        <FadeUp>
          <Overline>The control layer</Overline>
          <Display className="mt-6 max-w-3xl text-3xl md:text-5xl">
            Six disciplines. One verified source of truth.
          </Display>
        </FadeUp>
        <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map(({ icon: Icon, title, body }) => (
            <StaggerItem key={title}>
              <LuxCard className="h-full">
                <Icon className="size-6 text-gold" strokeWidth={1.25} aria-hidden />
                <h3 className="mt-6 font-cormorant text-2xl font-normal text-offwhite">{title}</h3>
                <p className="mt-3 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/65">
                  {body}
                </p>
              </LuxCard>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Five stakeholders */}
      <Section className="border-t border-gold/15">
        <FadeUp>
          <Overline>One program · five points of view</Overline>
          <Display className="mt-6 max-w-3xl text-3xl md:text-5xl">
            Everyone on the program. One source of truth they all trust.
          </Display>
        </FadeUp>
        <Stagger className="mt-14 flex flex-col divide-y divide-gold/15 border-y border-gold/15">
          {AUDIENCES.map((a) => (
            <StaggerItem key={a.href}>
              <a
                href={a.href}
                aria-label={`BaytyAI for ${a.label}`}
                className="group flex flex-col gap-2 py-8 transition-colors hover:bg-navy-card/60 md:flex-row md:items-center md:justify-between md:px-4"
              >
                <div>
                  <span className="font-cormorant text-3xl font-light text-offwhite transition-colors group-hover:text-gold">
                    {a.label}
                  </span>
                  <p className="mt-1 font-dmsans text-sm font-light text-offwhite/60">{a.line}</p>
                </div>
                <ArrowRight
                  className="size-5 text-gold opacity-0 transition-opacity group-hover:opacity-100"
                  aria-hidden
                />
              </a>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Trust band */}
      <Section className="border-t border-gold/15">
        <FadeUp className="flex flex-col items-start gap-6">
          <Eye className="size-7 text-gold" strokeWidth={1.25} aria-hidden />
          <Display className="max-w-4xl text-2xl md:text-4xl">
            Access is verified, granted by invitation, and earned. That is not a barrier — it is the
            reason the platform can be trusted with a program worth more than most nations spend in
            a year.
          </Display>
        </FadeUp>
      </Section>

      {/* Final CTA */}
      <Section className="border-t border-gold/15">
        <FadeUp className="border-[0.5px] border-gold/30 bg-navy-card px-8 py-16 text-center md:px-16 md:py-24">
          <Overline className="mx-auto">Request access</Overline>
          <Display className="mx-auto mt-6 max-w-3xl text-3xl md:text-5xl">
            The programs that will define the next decade are being governed now.
          </Display>
          <p className="mx-auto mt-6 max-w-xl font-dmsans text-base font-light text-offwhite/70">
            Access is limited and reviewed. Tell us about your program and your role, and we will
            evaluate your invitation to the platform.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <PrimaryCTA href="/access" ariaLabel="Request access to BaytyAI">
              Request Access <ArrowRight className="size-4" aria-hidden />
            </PrimaryCTA>
            <SecondaryCTA href="/about" ariaLabel="Learn about BaytyAI">
              Why BaytyAI exists
            </SecondaryCTA>
          </div>
        </FadeUp>
      </Section>
    </LuxShell>
  );
}
