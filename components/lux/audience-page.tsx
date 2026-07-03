import { ArrowRight } from 'lucide-react';

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

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

export type AudienceContent = {
  /** Small eyebrow above the hero headline. */
  eyebrow: string;
  /** Pain-led hero headline. Wrap the sharpest phrase in <span className="text-gold">. */
  headline: ReactNode;
  /** Supporting hero paragraph — makes the pain concrete and expensive. */
  lede: string;
  /** Three quantified costs of the unresolved pain. */
  costs: { figure: string; label: string }[];
  /** The reframe — from their old reality to how BaytyAI changes it. */
  shift: { heading: string; paragraphs: string[] };
  /** Outcome cards — what changes for this stakeholder, in their language. */
  outcomesHeading: string;
  outcomes: { icon: LucideIcon; title: string; body: string }[];
  /** Closing line above the final CTA. */
  closing: string;
};

const OTHER_AUDIENCES = [
  { label: 'Client / Owner', href: '/audiences/client' },
  { label: 'Consultant', href: '/audiences/consultant' },
  { label: 'Contractor', href: '/audiences/contractor' },
  { label: 'Subcontractor', href: '/audiences/subcontractor' },
  { label: 'Supplier', href: '/audiences/supplier' },
];

export default function AudiencePage({
  slug,
  content,
}: {
  slug: string;
  content: AudienceContent;
}) {
  return (
    <LuxShell>
      {/* Hero */}
      <section className="pt-[76px]">
        <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-36">
          <FadeUp>
            <Overline>{content.eyebrow}</Overline>
          </FadeUp>
          <FadeUp delay={0.08} className="mt-8 max-w-4xl">
            <Display as="h1" className="text-4xl md:text-6xl">
              {content.headline}
            </Display>
          </FadeUp>
          <FadeUp delay={0.16} className="mt-8 max-w-2xl">
            <Lede>{content.lede}</Lede>
          </FadeUp>
          <FadeUp delay={0.24} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <PrimaryCTA href="/access" ariaLabel="Request access to BaytyAI">
              Request Access <ArrowRight className="size-4" aria-hidden />
            </PrimaryCTA>
            <SecondaryCTA href="#outcomes" ariaLabel="See what changes">
              What changes for you
            </SecondaryCTA>
          </FadeUp>
        </div>
      </section>

      {/* Cost of the pain */}
      <Section className="border-t border-gold/15">
        <FadeUp>
          <Overline>What it costs you today</Overline>
        </FadeUp>
        <Stagger className="mt-12 grid grid-cols-1 gap-px overflow-hidden border-[0.5px] border-gold/20 md:grid-cols-3">
          {content.costs.map((c) => (
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

      {/* The shift */}
      <Section className="border-t border-gold/15">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-12">
          <FadeUp className="md:col-span-5">
            <Overline>The shift</Overline>
            <Display className="mt-6 text-3xl md:text-4xl">{content.shift.heading}</Display>
          </FadeUp>
          <FadeUp delay={0.1} className="flex flex-col gap-6 md:col-span-7">
            {content.shift.paragraphs.map((p, i) => (
              <p
                key={i}
                className="font-dmsans text-lg font-light leading-relaxed text-offwhite/75"
              >
                {p}
              </p>
            ))}
          </FadeUp>
        </div>
      </Section>

      {/* Outcomes */}
      <Section id="outcomes" className="border-t border-gold/15">
        <FadeUp>
          <Overline>What changes</Overline>
          <Display className="mt-6 max-w-3xl text-3xl md:text-5xl">
            {content.outcomesHeading}
          </Display>
        </FadeUp>
        <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {content.outcomes.map(({ icon: Icon, title, body }) => (
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

      {/* Final CTA */}
      <Section className="border-t border-gold/15">
        <FadeUp className="border-[0.5px] border-gold/30 bg-navy-card px-8 py-16 text-center md:px-16 md:py-24">
          <Display className="mx-auto max-w-3xl text-3xl md:text-5xl">{content.closing}</Display>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <PrimaryCTA href="/access" ariaLabel="Request access to BaytyAI">
              Request Access <ArrowRight className="size-4" aria-hidden />
            </PrimaryCTA>
            <SecondaryCTA href="/" ariaLabel="Back to the BaytyAI overview">
              See the full platform
            </SecondaryCTA>
          </div>
        </FadeUp>
      </Section>

      {/* Cross-links to the other stakeholders */}
      <Section className="border-t border-gold/15">
        <FadeUp>
          <Overline>Every seat at the table</Overline>
        </FadeUp>
        <div className="mt-8 flex flex-wrap gap-3">
          {OTHER_AUDIENCES.filter((a) => !a.href.endsWith(slug)).map((a) => (
            <a
              key={a.href}
              href={a.href}
              className="border-[0.5px] border-gold/25 px-5 py-2.5 font-dmmono text-[11px] uppercase tracking-[0.16em] text-offwhite/70 transition-colors hover:border-gold hover:text-gold"
            >
              {a.label}
            </a>
          ))}
        </div>
      </Section>
    </LuxShell>
  );
}
