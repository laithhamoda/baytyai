// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

const FAQS = [
  {
    q: 'What is BaytyAI?',
    a: 'BaytyAI is an AI-native project control layer for global Facilities Management, Construction, and infrastructure mega-projects. It is a productized library of operator-grade prompts, workflows, and governance systems, not a consulting retainer.',
  },
  {
    q: 'How is this different from hiring McKinsey, Accenture, or a Big 4 advisory?',
    a: 'Traditional consulting delivers a deck. BaytyAI deploys a working AI operations layer against a live contract, with measurable margin recovery and SLA outcomes — at roughly 5 to 10 percent of the cost of a comparable advisory engagement.',
  },
  {
    q: 'Do you work in Arabic?',
    a: 'Yes. All deliverables can be produced bilingually in Arabic and English. The founder operates natively in both.',
  },
  {
    q: 'What contract sizes do you work with?',
    a: 'BaytyAI is built for FM and Construction contracts above $5M in annual value. Smaller contracts are typically better served by adjacent BaytyAI training products.',
  },
  {
    q: 'How do you handle data residency for enterprise clients?',
    a: 'Sensitive project data can be handled through enterprise deployment planning that accounts for regional data residency, privacy, and procurement requirements. NDA-first engagement is standard.',
  },
  {
    q: 'Can you integrate with our existing CAFM platform — Maximo, Archibus, Planon, or FSI Concept?',
    a: 'Yes. The BaytyAI workflows are CAFM-agnostic and have been designed to layer on top of existing platforms, not replace them.',
  },
  {
    q: 'What is the typical ROI timeline?',
    a: 'On the Contract Margin X-Ray, recovered margin is typically identified within the 2-week Diagnostic window. Realized margin recovery follows in the next operational quarter.',
  },
  {
    q: 'Are NDAs and IP assignment standard?',
    a: 'Yes. BaytyAI signs mutual NDAs as standard, and all client-specific IP generated during an engagement is assigned to the client at handover.',
  },
] as const;

export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="bg-ink-900 py-24">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          id="faq-heading"
          h2="What global operators ask before they book."
          className="mb-16"
        />
        <div className="flex flex-col divide-y divide-ink-700">
          {FAQS.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-8 marker:content-none">
                <span className="font-sans text-base font-medium text-ink-100">{item.q}</span>
                <span
                  className="mt-1 shrink-0 font-mono text-ink-500 transition-transform group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 font-sans text-sm leading-relaxed text-ink-300">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
