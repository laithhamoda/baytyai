// Server Component
import Badge from '@/components/ds/Badge';
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';
import { siteConfig } from '@/lib/siteConfig';

const CREDENTIALS = [
  'Mechanical & HVAC Engineering',
  'GCC Site Experience',
  'BTEC Certified Evaluator',
  'AR / EN / FR',
] as const;

export default function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-heading" className="bg-ink-950 py-24">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
          {/* Portrait slot */}
          <div className="shrink-0">
            {/* TODO_FOUNDER_PORTRAIT */}
            <div className="flex h-[320px] w-[320px] items-center justify-center border border-ink-700 bg-ink-800">
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Portrait placeholder
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="THE OPERATOR BEHIND BAYTYAI"
              h2="Laith Hamoda — Senior AI Prompt Engineer for Mega Projects."
            />

            <div className="flex flex-col gap-4">
              <p className="font-sans text-base leading-relaxed text-ink-300">
                Laith Hamoda is the founder of BaytyAI and a Senior AI Prompt Engineer specializing
                in Facilities Management and Construction mega-projects across the GCC. His
                engineering background spans mechanical and HVAC delivery on prominent UAE sites,
                and he holds a certified BTEC evaluator role teaching engineering subjects in
                Jordan.
              </p>
              <p className="font-sans text-base leading-relaxed text-ink-300">
                Laith publishes the GCC FM Prompt Series on LinkedIn — one operator-grade prompt at
                a time — and builds the AI workflows that BaytyAI deploys into live contracts. He
                operates in Arabic, English, and French, from Amman.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {CREDENTIALS.map((c) => (
                <Badge key={c}>{c}</Badge>
              ))}
            </div>

            <a
              href={siteConfig.founder.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-sm font-medium text-signal-500 transition-colors hover:text-ink-100"
            >
              Connect on LinkedIn →
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}
