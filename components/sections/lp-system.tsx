// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

const MODULES = [
  {
    name: 'Contract Margin X-Ray',
    definition:
      'An AI-driven diagnostic that maps every clause, KPI, and cost assumption in a live FM or Construction contract to its margin exposure.',
    deliverables: ['clause-level margin map', 'cost leakage heat list', '30-day recovery actions'],
    outcome: 'Identify 1.8–4.6% recoverable margin per contract.',
  },
  {
    name: '90-Day Mobilization Schedule',
    definition:
      'An AI-assembled mobilization plan covering staffing, CAFM setup, asset tagging, SLA baselining, supplier readiness, and HSE compliance — sequenced day by day across the contractual mobilization window.',
    deliverables: ['daily mobilization gantt', 'risk register', 'readiness gates'],
    outcome: 'Hit week-13 go-live with zero LD exposure.',
  },
  {
    name: 'SLA Defense Architecture',
    definition:
      'An AI-monitored framework that converts SLA performance from reactive reporting into pre-emptive defense — surfacing KPI risk before the breach, with a defensible audit trail.',
    deliverables: [
      'KPI risk dashboard logic',
      'breach pre-warning prompts',
      'client-facing defense pack',
    ],
    outcome: 'Cut quarterly penalty exposure by half within two cycles.',
  },
] as const;

export default function System() {
  return (
    <section id="system" aria-labelledby="system-heading" className="bg-ink-950 py-24">
      <Container>
        <SectionHeading
          eyebrow="THE BAYTYAI SYSTEM"
          id="system-heading"
          h2="Three operator-grade AI modules. Built for the contracts that matter."
          sub="BaytyAI is an AI-native operations layer — a library of production prompts, workflows, and decision frameworks deployed against the specific failure modes of GCC FM and Construction delivery."
          className="mb-16"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {MODULES.map((m, i) => (
            <div key={m.name} className="flex flex-col gap-6 border border-ink-700 bg-ink-900 p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="font-mono text-[10px] text-ink-500">0{i + 1}</span>
              </div>
              <h3 className="font-sans text-lg font-semibold text-ink-100">{m.name}</h3>
              <p className="font-sans text-sm leading-relaxed text-ink-300">{m.definition}</p>
              <ul className="flex flex-col gap-2">
                {m.deliverables.map((d) => (
                  <li key={d} className="flex items-baseline gap-2">
                    <span className="mt-1 size-1 shrink-0 bg-signal-500" aria-hidden="true" />
                    <span className="font-mono text-[11px] text-ink-300">{d}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-ink-700 pt-4">
                <p className="font-mono text-[11px] text-signal-500">{m.outcome}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
