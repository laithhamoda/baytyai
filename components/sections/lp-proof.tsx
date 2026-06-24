// Server Component
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import { siteConfig } from '@/lib/siteConfig';

const PROMPTS = [
  { n: '01', title: 'Prompt 01', comment: 'TODO_PROOF_EXCERPT_01' },
  { n: '02', title: 'Prompt 02', comment: 'TODO_PROOF_EXCERPT_02' },
  { n: '03', title: 'Prompt 03', comment: 'TODO_PROOF_EXCERPT_03' },
] as const;

export default function Proof() {
  return (
    <section id="proof" aria-labelledby="proof-heading" className="bg-ink-900 py-24">
      <Container>
        <SectionHeading
          eyebrow="PROOF, IN PUBLIC"
          h2="The GCC FM Prompt Series — operator-grade prompts published live on LinkedIn."
          sub="BaytyAI publishes one operator-grade prompt at a time on LinkedIn. Each prompt is one layer of the Contract Margin X-Ray, the 90-Day Mobilization Schedule, or the SLA Defense Architecture — used in production engagements."
          className="mb-16"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PROMPTS.map((p) => (
            <div key={p.n} className="flex flex-col gap-4 border border-ink-700 bg-ink-800 p-8">
              <span className="font-mono text-[10px] text-ink-500">PROMPT {p.n}</span>
              <h3 className="font-sans text-base font-semibold text-ink-100">{p.title}</h3>
              {/* TODO_PROOF_EXCERPT_01 */}
              {/* TODO_PROOF_EXCERPT_02 */}
              {/* TODO_PROOF_EXCERPT_03 */}
              <p className="font-sans text-sm italic leading-relaxed text-ink-500">
                [LinkedIn post excerpt — to be added before deploy]
              </p>
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
