// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

const PROBLEMS = [
  {
    title: 'Margin Erosion',
    definition:
      'Margin erosion is the unrecovered cost leakage between contract pricing assumptions and live operational delivery — typically 1.8 to 4.6 percent of contract value per year on FM contracts above $5M [internal benchmark].',
    consequence:
      'By year three, the contract is delivering at break-even while the P&L still books it as profitable.',
  },
  {
    title: 'Mobilization Slip',
    definition:
      'Mobilization slip is the failure to fully stand up service delivery within the contractual 90-day window — staffing, CAFM configuration, asset register, SLA baselines, and supplier onboarding.',
    consequence: 'Liquidated damages trigger in week 13. Client trust never fully recovers.',
  },
  {
    title: 'SLA Breach Cascade',
    definition:
      'SLA breach cascade is the compounding penalty structure that converts isolated KPI misses into systemic contract penalty exposure.',
    consequence:
      'One reactive maintenance backlog becomes three breached KPIs becomes a quarterly penalty deduction.',
  },
] as const;

export default function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-heading" className="bg-ink-900 py-24">
      <Container>
        <SectionHeading
          eyebrow="THE OPERATOR PROBLEM"
          h2="Three failure modes are quietly eroding every multi-year FM and Construction contract in the GCC."
          className="mb-16"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROBLEMS.map((p) => (
            <div key={p.title} className="flex flex-col gap-4 border border-ink-700 bg-ink-800 p-8">
              <h3 className="font-sans text-lg font-semibold text-ink-100">{p.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-ink-300">{p.definition}</p>
              <div className="mt-auto border-l-2 border-signal-500 pl-4">
                <p className="font-mono text-[11px] leading-relaxed text-ink-500">
                  {p.consequence}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
