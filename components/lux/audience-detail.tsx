import { ArrowRight, Check, X } from 'lucide-react';
import Link from 'next/link';

import { LuxShell } from '@/components/lux/chrome';
import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';

import type { LucideIcon } from 'lucide-react';

/**
 * Bespoke audience-page renderer (navy + gold lux system) driven by structured,
 * role-specific data. Five sections: verdict hero → named-and-priced pain →
 * command center → before/after → closing CTA. Used by every /audiences/* page.
 */

export type AudienceDetailData = {
  /** URL slug, e.g. "consultant" — also used as the /access?role= value. */
  slug: string;
  /** Breadcrumb tail, e.g. "Consultant". */
  breadcrumb: string;
  /** Hero headline split so the second clause can render in gold. */
  headline: { plain: string; gold: string };
  /** Hero supporting paragraph. */
  sub: string;
  /** Access CTA label, e.g. "Request consultant access". */
  ctaLabel: string;
  painOverline: string;
  painHeading: string;
  pains: { icon: LucideIcon; title: string; body: string; cost: string }[];
  ccOverline: string;
  ccHeading: string;
  ccSub: string;
  capabilities: { icon: LucideIcon; title: string; body: string }[];
  before: string[];
  after: string[];
  closingHeading: string;
  closingSub: string;
};

export default function AudienceDetail({ data }: { data: AudienceDetailData }) {
  const accessHref = `/access?role=${data.slug}`;

  return (
    <LuxShell>
      {/* ── SECTION 1 — HERO ── */}
      <section className="pt-[76px]">
        <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-36">
          <Stagger className="flex flex-col">
            <StaggerItem>
              <p className="font-dmmono text-[10px] uppercase tracking-[0.28em] text-gold">
                BaytyAI → {data.breadcrumb}
              </p>
            </StaggerItem>
            <StaggerItem>
              <h1 className="mt-8 max-w-4xl font-cormorant text-[clamp(2rem,7vw,4.5rem)] font-light leading-[1.06] tracking-[-0.01em] text-offwhite">
                {data.headline.plain}
                <span className="text-gold"> {data.headline.gold}</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mt-8 max-w-2xl font-dmsans text-lg font-light leading-relaxed text-offwhite/65 md:text-xl">
                {data.sub}
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  href={accessHref}
                  aria-label={data.ctaLabel}
                  className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  {data.ctaLabel} <ArrowRight className="size-4" aria-hidden />
                </Link>
                <a
                  href="#command-center"
                  aria-label="See the BaytyAI command center"
                  className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                >
                  See how it works <ArrowRight className="size-4" aria-hidden />
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
              {data.painOverline}
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[52px]">
              {data.painHeading}
            </h2>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {data.pains.map(({ icon: Icon, title, body, cost }) => (
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
              {data.ccOverline}
            </p>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-light leading-[1.08] text-offwhite md:text-[52px]">
              {data.ccHeading}
            </h2>
            <p className="mt-6 max-w-2xl font-dmsans text-lg font-light leading-relaxed text-offwhite/65">
              {data.ccSub}
            </p>
          </FadeUp>
          <Stagger className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data.capabilities.map(({ icon: Icon, title, body }) => (
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
                {data.before.map((line) => (
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
                {data.after.map((line) => (
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
              {data.closingHeading}
            </h2>
            <p className="mx-auto mt-6 max-w-xl font-dmsans text-lg font-light text-offwhite/65">
              {data.closingSub}
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href={accessHref}
                aria-label={data.ctaLabel}
                className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
              >
                {data.ctaLabel} <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </LuxShell>
  );
}
