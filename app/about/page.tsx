import Link from 'next/link';

import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import { siteConfig } from '@/lib/siteConfig';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About — BaytyAI',
  description:
    'BaytyAI is the global verified marketplace and operations platform connecting clients, consultants, contractors, subcontractors, and suppliers in construction and facilities management. Founded by Laith Hamoda.',
  alternates: { canonical: 'https://baytyai.com/about' },
};

const VALUES = [
  {
    label: 'Verified',
    title: 'Trust before transactions',
    body: 'Every stakeholder is checked before they transact. Identity and business verification is the foundation of every connection on the platform.',
  },
  {
    label: 'Structured',
    title: 'A record for every decision',
    body: 'Inquiries, quotations, approvals, and documents follow a controlled workflow with a full audit trail — nothing lives in a lost inbox or chat thread.',
  },
  {
    label: 'Global',
    title: 'Worldwide, bilingual',
    body: 'Built for construction and facilities-management projects anywhere in the world, operating natively in English and Arabic.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-steel-50">
      {/* Hero */}
      <section className="pb-24 pt-40">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-10 h-px w-14 bg-bayty-500/60" />
            <h1 className="font-sans text-[clamp(2rem,5vw,3.25rem)] font-semibold leading-tight text-steel-900 [text-wrap:balance]">
              The world builds together. It deserves a platform where every party is verified and
              every decision is recorded.
            </h1>
          </div>
        </Container>
      </section>

      {/* Mission */}
      <section className="border-t border-steel-200 py-24">
        <Container>
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">
              Our Mission
            </p>
            <p className="font-sans text-2xl font-normal leading-relaxed text-steel-900">
              BaytyAI exists to make the global construction and facilities-management supply chain
              verifiable, structured, and trusted — connecting clients, consultants, contractors,
              subcontractors, and suppliers on one platform where identity is proven and every
              inquiry, quotation, approval, and document is on the record.
            </p>
          </div>
        </Container>
      </section>

      {/* Values */}
      <section className="border-t border-steel-200 py-24">
        <Container>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.label} className="border border-steel-200 bg-white p-8">
                <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">
                  {v.label}
                </p>
                <h3 className="mb-3 font-sans text-lg font-semibold text-steel-900">{v.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-steel-600">{v.body}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="border-t border-steel-200 py-24">
        <Container>
          <SectionHeading
            eyebrow="The Founder"
            id="founder-heading"
            h2="Laith Hamoda"
            className="mb-10"
          />
          <div className="max-w-2xl border-l-2 border-bayty-500 bg-white p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-bayty-600">
              Founder &amp; CEO
            </p>
            <p className="mt-5 font-sans text-base leading-relaxed text-steel-600">
              Laith Hamoda founded BaytyAI to bring verification, structure, and trust to how the
              world&rsquo;s construction and facilities-management projects connect and transact.
              His background spans mechanical and HVAC engineering on major sites and a certified
              BTEC evaluator role, and he builds the workflows that power the platform — operating
              in English, Arabic, and French.
            </p>
            <a
              href={siteConfig.founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-sans text-sm font-medium text-bayty-600 transition-colors hover:text-steel-900"
            >
              Connect on LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="border-t border-steel-200 py-24">
        <Container>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/#book"
              className="inline-flex items-center justify-center bg-bayty-500 px-8 py-4 font-sans text-base font-medium text-white transition-colors hover:bg-bayty-600"
            >
              Book a Strategy Consultation
            </Link>
            <a
              href="mailto:founder@baytyai.com"
              className="inline-flex items-center justify-center border border-steel-200 px-8 py-4 font-sans text-base text-steel-600 transition-colors hover:border-bayty-500 hover:text-bayty-600"
            >
              founder@baytyai.com
            </a>
          </div>
        </Container>
      </section>
    </div>
  );
}
