// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

const TIERS = [
  {
    name: 'Strategy Consultation',
    price: '$750',
    unit: '90 minutes',
    description:
      'Mapped against your contract portfolio. Output: prioritized intervention list. Credited toward the Diagnostic Engagement.',
    cta: 'Book Now',
    featured: false,
  },
  {
    name: 'Diagnostic Engagement',
    price: '$12,000',
    unit: '2 weeks',
    description: 'One live contract. One module deployed end to end. Full output pack delivered.',
    cta: 'Book Consultation to Scope',
    featured: true,
  },
  {
    name: 'Embedded Engagement',
    price: '$45,000',
    unit: 'per quarter',
    description: 'Portfolio-wide deployment, weekly cadence, operator handover at end of quarter.',
    cta: 'Book Consultation to Scope',
    featured: false,
  },
] as const;

export default function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-ink-950 py-24">
      <Container>
        <SectionHeading
          eyebrow="PRICING"
          id="pricing-heading"
          h2="Transparent pricing. Anchored to recoverable margin."
          sub="Every engagement begins with a paid Strategy Consultation. The full diagnostic and embedded tiers are scoped against the contract value at stake."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`flex flex-col gap-6 border p-8 ${
                t.featured ? 'border-signal-500 bg-ink-900' : 'border-ink-700 bg-ink-900'
              }`}
            >
              {t.featured && (
                <span className="self-start border border-signal-500/40 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-signal-500">
                  Recommended start
                </span>
              )}
              <div>
                <h3 className="mb-1 font-sans text-base font-semibold text-ink-100">{t.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-medium text-ink-100">
                    from {t.price}
                  </span>
                  <span className="font-mono text-[11px] text-ink-500">{t.unit}</span>
                </div>
              </div>
              <p className="flex-1 font-sans text-sm leading-relaxed text-ink-300">
                {t.description}
              </p>
              <a
                href="#book"
                className="inline-flex items-center justify-center border border-signal-500 px-5 py-2.5 font-sans text-sm font-medium text-signal-500 transition-colors hover:bg-signal-500 hover:text-ink-950"
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] text-ink-500">
          Pricing is in USD. VAT applied per jurisdiction. Contract size and scope drive final
          pricing.
        </p>
      </Container>
    </section>
  );
}
