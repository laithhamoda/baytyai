import Badge from '@/components/ds/Badge';
import Button from '@/components/ds/Button';
import Container from '@/components/ds/Container';
import SectionHeading from '@/components/ds/SectionHeading';

export default function StyleguidePage() {
  return (
    <div className="min-h-screen bg-ink-950 py-24">
      <Container>
        <div className="flex flex-col gap-24">
          {/* Colors */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Color tokens
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ['ink-950', '#07090C'],
                ['ink-900', '#0E1116'],
                ['ink-800', '#161B22'],
                ['ink-700', '#21262D'],
                ['ink-500', '#6E7681'],
                ['ink-300', '#B1B9C2'],
                ['ink-100', '#E6E9EE'],
                ['paper', '#F5F6F8'],
                ['signal-500', '#C5A572'],
                ['signal-600', '#A8895C'],
                ['alert-500', '#D9534F'],
                ['success-500', '#3FA796'],
              ].map(([name, hex]) => (
                <div key={name} className="flex flex-col gap-2">
                  <div
                    className="h-12 w-full border border-ink-700"
                    style={{ backgroundColor: hex }}
                  />
                  <p className="font-mono text-[10px] text-ink-300">{name}</p>
                  <p className="font-mono text-[10px] text-ink-500">{hex}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Typography */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Typography
            </p>
            <div className="flex flex-col gap-6 border-l border-ink-700 pl-8">
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Inter Tight — display heading
              </p>
              <h1 className="font-sans text-display-lg font-semibold text-ink-100">
                Protect Contract Margin.
              </h1>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                Inter Tight 500 — body
              </p>
              <p className="max-w-prose font-sans text-base font-medium leading-relaxed text-ink-300">
                BaytyAI delivers operator-grade prompt libraries and AI workflows that protect
                margin, accelerate mobilization, and harden SLA performance on FM and construction
                contracts above $5M.
              </p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
                JetBrains Mono — KPIs / contract figures
              </p>
              <p className="font-mono text-2xl font-medium text-signal-500">
                $47.3M · 94.2% SLA · 23-day mobilization
              </p>
            </div>
          </section>

          {/* Buttons */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Buttons
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="primary" size="lg">
                Book Strategy Call
              </Button>
              <Button variant="primary" size="md">
                Book Strategy Call
              </Button>
              <Button variant="secondary" size="lg">
                Download X-Ray
              </Button>
              <Button variant="secondary" size="md">
                Download X-Ray
              </Button>
              <Button variant="ghost" size="md">
                Learn more
              </Button>
              <Button variant="primary" size="md" disabled>
                Disabled
              </Button>
            </div>
          </section>

          {/* Badges */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Badges
            </p>
            <div className="flex flex-wrap gap-3">
              <Badge>GCC</Badge>
              <Badge>FM</Badge>
              <Badge>Construction</Badge>
              <Badge>Mega Project</Badge>
              <Badge>$5M+</Badge>
            </div>
          </section>

          {/* Section Headings */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Section headings
            </p>
            <div className="flex flex-col gap-16">
              <SectionHeading
                eyebrow="The problem"
                h2="Margin bleeds before anyone notices."
                sub="On contracts above $5M, the gap between bid assumptions and operational reality compounds silently — through mobilization delays, SLA penalties, and untracked scope creep."
              />
              <SectionHeading
                eyebrow="Centered variant"
                h2="AI-Native Infrastructure for Operators."
                sub="Not a chat tool. A structured intervention at every contract risk point."
                align="center"
              />
            </div>
          </section>

          {/* Spacing */}
          <section>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-widest text-signal-500">
              Spacing scale (custom)
            </p>
            <div className="flex flex-col gap-2">
              {[
                ['18', '4.5rem / 72px'],
                ['22', '5.5rem / 88px'],
                ['30', '7.5rem / 120px'],
              ].map(([token, val]) => (
                <div key={token} className="flex items-center gap-4">
                  <p className="w-12 font-mono text-[10px] text-ink-300">{token}</p>
                  <p className="font-mono text-[10px] text-ink-500">{val}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
