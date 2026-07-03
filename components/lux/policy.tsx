import { ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';

import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/**
 * Shared building blocks for the /security and /compliance pages — an
 * enterprise "trust document" layout on the navy + gold lux system.
 */

export function PolicyHero({
  breadcrumb,
  headline,
  sub,
  updated,
}: {
  breadcrumb: string;
  headline: { plain: string; gold: string };
  sub: string;
  updated: string;
}) {
  return (
    <section className="pt-[76px]">
      <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-36">
        <FadeUp>
          <p className="font-dmmono text-[10px] uppercase tracking-[0.28em] text-gold">
            {breadcrumb}
          </p>
        </FadeUp>
        <FadeUp delay={0.08} className="mt-8 max-w-4xl">
          <h1 className="font-cormorant text-[44px] font-light leading-[1.06] tracking-[-0.01em] text-offwhite md:text-[68px]">
            {headline.plain} <span className="text-gold">{headline.gold}</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.16} className="mt-8 max-w-2xl">
          <p className="font-dmsans text-lg font-light leading-relaxed text-offwhite/65 md:text-xl">
            {sub}
          </p>
        </FadeUp>
        <FadeUp delay={0.24} className="mt-8">
          <p className="font-dmmono text-[11px] uppercase tracking-[0.18em] text-offwhite/40">
            Last updated · {updated}
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

export type Control = { icon: LucideIcon; title: string; points: string[] };

/** A titled band of control cards. `light` renders on the off-white field. */
export function ControlBand({
  overline,
  heading,
  intro,
  controls,
  light,
}: {
  overline: string;
  heading: string;
  intro?: string;
  controls: Control[];
  light?: boolean;
}) {
  return (
    <section
      className={`py-24 md:py-section ${light ? 'bg-offwhite text-navy' : 'border-t border-gold/15'}`}
    >
      <div className="mx-auto w-full max-w-container px-6 md:px-10">
        <FadeUp>
          <p
            className={`font-dmmono text-[11px] uppercase tracking-[0.28em] ${light ? 'text-slateink' : 'text-gold'}`}
          >
            {overline}
          </p>
          <h2
            className={`mt-6 max-w-3xl font-cormorant text-3xl leading-[1.1] md:text-[44px] ${light ? 'font-semibold text-navy' : 'font-light text-offwhite'}`}
          >
            {heading}
          </h2>
          {intro && (
            <p
              className={`mt-5 max-w-2xl font-dmsans text-base font-light leading-relaxed ${light ? 'text-slateink' : 'text-offwhite/65'}`}
            >
              {intro}
            </p>
          )}
        </FadeUp>
        <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {controls.map(({ icon: Icon, title, points }) => (
            <StaggerItem key={title}>
              <div
                className={`h-full border-[0.5px] p-8 ${light ? 'border-navy/15 bg-white' : 'border-gold/25 bg-navy-card'}`}
                style={{ borderRadius: 2 }}
              >
                <Icon
                  className={`size-6 ${light ? 'text-navy' : 'text-gold'}`}
                  strokeWidth={1.25}
                  aria-hidden
                />
                <h3
                  className={`mt-6 font-dmsans text-lg font-medium ${light ? 'text-navy' : 'text-offwhite'}`}
                >
                  {title}
                </h3>
                <ul className="mt-4 flex flex-col gap-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <Check
                        className={`mt-0.5 size-4 shrink-0 ${light ? 'text-navy/60' : 'text-gold'}`}
                        strokeWidth={2}
                        aria-hidden
                      />
                      <span
                        className={`font-dmsans text-[14px] font-light leading-relaxed ${light ? 'text-slateink' : 'text-offwhite/70'}`}
                      >
                        {p}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export type Faq = { q: string; a: string };

export function FaqBand({
  overline,
  heading,
  faqs,
}: {
  overline: string;
  heading: string;
  faqs: Faq[];
}) {
  return (
    <section className="border-t border-gold/15 py-24 md:py-section">
      <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
        <FadeUp>
          <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold">
            {overline}
          </p>
          <h2 className="mt-6 font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[44px]">
            {heading}
          </h2>
        </FadeUp>
        <Stagger className="mt-12 flex flex-col divide-y divide-gold/15 border-y border-gold/15">
          {faqs.map(({ q, a }) => (
            <StaggerItem key={q}>
              <div className="py-7">
                <h3 className="font-dmsans text-base font-medium text-offwhite">{q}</h3>
                <p className="mt-3 font-dmsans text-[15px] font-light leading-relaxed text-offwhite/65">
                  {a}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function PolicyCTA({
  heading,
  sub,
  primary,
  secondaryEmail,
}: {
  heading: string;
  sub: string;
  primary: { href: string; label: string };
  secondaryEmail: string;
}) {
  return (
    <section className="border-t border-gold/15 py-24 md:py-section">
      <div className="mx-auto w-full max-w-container px-6 text-center md:px-10">
        <FadeUp>
          <h2 className="mx-auto max-w-3xl font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[48px]">
            {heading}
          </h2>
          <p className="mx-auto mt-6 max-w-xl font-dmsans text-base font-light text-offwhite/65">
            {sub}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href={primary.href}
              className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft"
            >
              {primary.label} <ArrowRight className="size-4" aria-hidden />
            </Link>
            <a
              href={`mailto:${secondaryEmail}`}
              className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10"
            >
              {secondaryEmail}
            </a>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/** FAQPage JSON-LD for GEO / rich-result visibility. */
export function FaqJsonLd({ faqs }: { faqs: Faq[] }) {
  const json = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }} />
  );
}

export function StatBand({ items }: { items: { figure: string; label: string }[] }) {
  return (
    <section className="border-t border-gold/15 py-16 md:py-20">
      <div className="mx-auto w-full max-w-container px-6 md:px-10">
        <Stagger className="grid grid-cols-1 gap-px overflow-hidden border-[0.5px] border-gold/20 sm:grid-cols-3">
          {items.map((it) => (
            <StaggerItem key={it.label} className="bg-navy-card p-8">
              <p className="font-cormorant text-4xl font-light text-gold">{it.figure}</p>
              <p className="mt-3 font-dmsans text-[14px] font-light leading-relaxed text-offwhite/65">
                {it.label}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

export function PolicyBody({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
