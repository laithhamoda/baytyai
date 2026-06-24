// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

const STEPS = [
  {
    n: '01',
    title: 'Strategy Consultation (90 minutes, paid).',
    body: 'We map your contract portfolio against the three failure modes and identify the single highest-leverage AI intervention for your operation.',
  },
  {
    n: '02',
    title: 'Diagnostic Engagement (2 weeks).',
    body: 'We run the Contract Margin X-Ray, 90-Day Mobilization Schedule, or SLA Defense Architecture against one live contract and deliver the full output pack.',
  },
  {
    n: '03',
    title: 'Embedded Engagement (one quarter).',
    body: 'We embed alongside your Operations or Commercial Director, deploy the relevant modules across the contract portfolio, and train your team on the prompt library.',
  },
  {
    n: '04',
    title: 'Operator Handover.',
    body: 'Your team owns the prompt library, the workflows, and the dashboards. We exit cleanly.',
  },
] as const;

export default function Process() {
  return (
    <section id="process" aria-labelledby="process-heading" className="bg-ink-900 py-24">
      <Container>
        <SectionHeading
          eyebrow="HOW AN ENGAGEMENT WORKS"
          id="process-heading"
          h2="Four steps. No retainer roulette."
          className="mb-16"
        />
        <div className="flex flex-col divide-y divide-ink-700">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="flex flex-col gap-4 py-8 md:flex-row md:items-start md:gap-16"
            >
              <span className="shrink-0 font-mono text-[11px] tracking-widest text-signal-500 md:w-8">
                {s.n}
              </span>
              <div className="flex flex-col gap-2">
                <h3 className="font-sans text-base font-semibold text-ink-100">{s.title}</h3>
                <p className="font-sans text-sm leading-relaxed text-ink-300">{s.body}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
