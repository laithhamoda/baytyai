// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import { siteConfig } from '@/lib/siteConfig';

const PROMPTS = [
  {
    n: '01',
    title: 'Contract Margin X-Ray',
    module: 'Margin Recovery',
    excerpt:
      'Most FM contracts bleed 2–4% in the first 90 days. Not through fraud — through scope ambiguity, reactive maintenance loops, and SLA clauses that were never operationalised. This prompt maps every clause to a measurable cost driver before the first invoice is raised.',
  },
  {
    n: '02',
    title: '90-Day Mobilisation Schedule',
    module: 'Mobilisation',
    excerpt:
      'The mobilisation window is where GCC mega-projects are won or lost. A missed KPI in week three compounds for 36 months. This prompt generates a day-by-day mobilisation decision tree against your specific contract scope, staffing plan, and CAFM onboarding sequence.',
  },
  {
    n: '03',
    title: 'SLA Defense Architecture',
    module: 'SLA Performance',
    excerpt:
      'Reactive SLA defence is a penalty waiting to happen. This prompt builds a forward-looking response matrix — by asset class, criticality tier, and seasonal load — so your team intercepts breaches before they are logged, not after the client escalation.',
  },
] as const;

export default function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-heading" className="bg-ink-900 py-24">
      <Container>
        <SectionHeading
          eyebrow="PROOF, IN PUBLIC"
          id="proof-heading"
          h2="The GCC FM Prompt Series — operator-grade prompts published live on LinkedIn."
          sub="BaytyAI publishes one operator-grade prompt at a time on LinkedIn. Each prompt is one layer of the Contract Margin X-Ray, the 90-Day Mobilization Schedule, or the SLA Defense Architecture — used in production engagements."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROMPTS.map((p) => (
            <div key={p.n} className="flex flex-col gap-4 border border-ink-700 bg-ink-800 p-8">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] text-ink-500">PROMPT {p.n}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-signal-500">
                  {p.module}
                </span>
              </div>
              <h3 className="font-sans text-base font-semibold text-ink-100">{p.title}</h3>
              <p className="font-sans text-sm leading-relaxed text-ink-300">{p.excerpt}</p>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <a
            href={siteConfig.founder.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm font-medium text-signal-500 transition-colors hover:text-ink-100"
          >
            Read the full series on LinkedIn →
          </a>
        </div>
      </Container>
    </section>
  );
}
