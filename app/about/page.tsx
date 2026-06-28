import Link from 'next/link';

import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import { siteConfig } from '@/lib/siteConfig';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — BaytyAI',
  description:
    'BaytyAI builds AI-native operations infrastructure for Facilities Management and Construction mega-projects across the GCC. Founded by Laith Hamoda, Senior AI Prompt Engineer.',
  alternates: { canonical: 'https://baytyai.com/about' },
};

const VALUES = [
  {
    label: 'Operator-grade',
    title: 'Built against live contracts',
    body: 'Every prompt and workflow is forged against a real FM or Construction contract — not a generic template. If it does not survive a live operation, it does not ship.',
  },
  {
    label: 'Margin-first',
    title: 'Measured in recovered margin',
    body: 'We anchor every engagement to the money at stake: recovered contract margin, defended SLAs, and a faster mobilization. Outcomes, not decks.',
  },
  {
    label: 'GCC-native',
    title: 'Bilingual, in-region',
    body: 'Deliverables in Arabic and English, data residency configured for Saudi and UAE, and an understanding of how the region actually delivers mega-projects.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-ink-950">
      {/* Hero */}
      <section className="pb-24 pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-10 h-px w-14 bg-signal-500/60" />
            <h1 className="font-sans text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight text-ink-100 [text-wrap:balance]">
              GCC operators run the most ambitious projects on earth. They deserve operations
              infrastructure built to match.
            </h1>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="border-t border-ink-700 py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-500">
              Our Mission
            </p>
            <p className="font-sans text-2xl font-normal leading-relaxed text-ink-100">
              BaytyAI exists to protect the margin, mobilization, and SLA performance of Facilities
              Management and Construction contracts in the GCC — by deploying AI-native operations
              infrastructure against the specific failure modes that quietly erode every multi-year
              contract above $5M.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-ink-700 py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.label} className="border border-ink-700 bg-ink-900 p-8">
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-signal-500">
                  {v.label}
                </p>
                <h3 className="mb-3 font-sans text-lg font-semibold text-ink-100">{v.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-ink-300">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="border-t border-ink-700 py-24">
        <Container>
          <SectionHeading
            eyebrow="The Founder"
            id="founder-heading"
            h2="Laith Hamoda"
            className="mb-10"
          />
          <div className="max-w-2xl border-l-2 border-signal-500 bg-ink-900 p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal-500">
              Senior AI Prompt Engineer for Mega Projects
            </p>
            <p className="mt-5 font-sans text-base leading-relaxed text-ink-300">
              Laith Hamoda founded BaytyAI to bring operator-grade AI into GCC Facilities Management
              and Construction. His background spans mechanical and HVAC delivery on prominent UAE
              sites and a certified BTEC evaluator role in Jordan. He publishes the GCC FM Prompt
              Series on LinkedIn — one operator-grade prompt at a time — and builds the workflows
              BaytyAI deploys into live contracts, operating in Arabic, English, and French from
              Amman.
            </p>
            <a
              href={siteConfig.founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-sans text-sm font-medium text-signal-500 transition-colors hover:text-ink-100"
            >
              Connect on LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-ink-700 py-24">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#book"
              className="inline-flex items-center justify-center bg-signal-500 px-8 py-4 font-sans text-base font-medium text-ink-950 transition-colors hover:bg-signal-600"
            >
              Book a Strategy Consultation
            </Link>
            <a
              href="mailto:founder@baytyai.com"
              className="inline-flex items-center justify-center border border-ink-700 px-8 py-4 font-sans text-base text-ink-300 transition-colors hover:border-signal-500 hover:text-signal-500"
            >
              founder@baytyai.com
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
