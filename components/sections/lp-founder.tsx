// Server Component
import Image from 'next/image';

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

function FounderPortrait() {
  return (
    <div className="relative h-[320px] w-[320px] shrink-0 overflow-hidden border border-ink-700 bg-ink-800">
      <Image
        src="/laith-hamoda.jpg"
        alt="Laith Hamoda — Founder of BaytyAI"
        fill
        sizes="320px"
        className="object-cover object-top"
        priority
        onError={undefined}
      />
      {/* Fallback monogram — visible only if image is missing (CSS layer trick) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center bg-ink-800"
        style={{ zIndex: -1 }}
      >
        <span className="font-mono text-4xl font-medium tracking-widest text-signal-500">LH</span>
      </div>
    </div>
  );
}

export default function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-heading" className="bg-ink-950 py-24">
      <Container>
        <div className="flex flex-col gap-12 lg:flex-row lg:items-start lg:gap-24">
          {/* Portrait */}
          <div className="shrink-0">
            <FounderPortrait />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="THE OPERATOR BEHIND BAYTYAI"
              id="founder-heading"
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
