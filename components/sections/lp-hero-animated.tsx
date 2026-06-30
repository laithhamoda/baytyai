'use client';

import dynamic from 'next/dynamic';

import Badge from '@/components/ds/Badge';
import Container from '@/components/ds/Container';
import Counter from '@/components/motion/Counter';
import MagneticButton from '@/components/motion/MagneticButton';
import Reveal from '@/components/motion/Reveal';

// Canvas background is client-only and lazy — never blocks first paint.
const CursorField = dynamic(() => import('@/components/motion/CursorField'), { ssr: false });

export default function HeroAnimated() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden bg-ink-950 pb-28 pt-36"
    >
      <CursorField />

      <Container>
        <div className="relative flex flex-col gap-16 lg:flex-row lg:items-center lg:gap-24">
          {/* Left */}
          <div className="flex flex-col gap-8 lg:max-w-screen-sm">
            <Reveal>
              <div className="flex flex-wrap gap-2">
                <Badge>Global</Badge>
                <Badge>Verified</Badge>
                <Badge>Construction</Badge>
                <Badge>Facilities Management</Badge>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h1
                id="hero-heading"
                className="font-sans text-[clamp(2.25rem,5.5vw,3.75rem)] font-semibold leading-[1.08] text-ink-100 [text-wrap:balance]"
              >
                The verified marketplace for construction &amp; facilities management.
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="font-sans text-base leading-relaxed text-ink-300 md:text-lg">
                BaytyAI connects verified clients, consultants, contractors, subcontractors, and
                suppliers worldwide — with structured inquiries, quotations, approvals, and document
                control on a single trusted platform.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <MagneticButton
                  href="#book"
                  className="inline-flex items-center justify-center bg-signal-500 px-8 py-4 font-sans text-base font-medium text-ink-950 transition-colors hover:bg-signal-600"
                >
                  Book a Strategy Consultation
                </MagneticButton>
                <a
                  href="#stakeholders"
                  className="font-sans text-sm font-medium text-signal-500 transition-colors hover:text-ink-100"
                >
                  See your role&rsquo;s ROI →
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right — animated KPI strip */}
          <Reveal delay={0.3} className="w-full lg:max-w-[320px]">
            <div className="border border-ink-700 bg-ink-900/80 p-8 backdrop-blur">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-signal-500">
                Platform Snapshot
              </p>
              <div className="flex flex-col divide-y divide-ink-700">
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Verified stakeholder roles
                  </p>
                  <p className="font-mono text-2xl font-medium text-ink-100">
                    <Counter to={5} />
                  </p>
                </div>
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Service area
                  </p>
                  <p className="font-mono text-2xl font-medium text-signal-500">Worldwide</p>
                </div>
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Languages
                  </p>
                  <p className="font-mono text-2xl font-medium text-ink-100">EN&nbsp;/&nbsp;AR</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
