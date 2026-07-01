// Server Component
import Badge from '@/components/ds/Badge';
import Container from '@/components/ds/Container';

export default function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading" className="bg-ink-950 pb-24 pt-32">
      <Container>
        <div className="flex flex-col gap-16 lg:flex-row lg:items-start lg:gap-24">
          <div className="flex flex-col gap-8 lg:max-w-screen-sm">
            <div className="flex flex-wrap gap-2">
              <Badge>Global</Badge>
              <Badge>FM</Badge>
              <Badge>Construction</Badge>
              <Badge>Mega Project</Badge>
            </div>

            <h1
              id="hero-heading"
              className="font-sans text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.1] text-ink-100 [text-wrap:balance]"
            >
              AI-Native Project Control Infrastructure for Global Facilities Management &
              Construction Mega Projects
            </h1>

            <p className="font-sans text-base font-normal leading-relaxed text-ink-300 md:text-lg">
              We protect contract margin, accelerate mobilization, and harden SLA performance for FM
              and Construction operators running complex contracts above $5M worldwide.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#book"
                className="inline-flex items-center justify-center bg-signal-500 px-8 py-4 font-sans text-base font-medium tracking-wide text-ink-950 transition-colors hover:bg-signal-600"
              >
                Book a Paid Strategy Consultation
              </a>
              <a
                href="#proof"
                className="font-sans text-sm font-medium text-signal-500 transition-colors hover:text-ink-100"
              >
                See the global project control prompt series
              </a>
            </div>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
              Built for operators delivering complex portfolios across global infrastructure, real
              estate, FM, and construction markets.
            </p>
          </div>

          <div className="w-full lg:max-w-[320px]">
            <div className="border border-ink-700 bg-ink-900 p-8">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-signal-500">
                Operator Snapshot
              </p>
              <div className="flex flex-col divide-y divide-ink-700">
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Contracts in scope
                  </p>
                  <p className="font-mono text-xl font-medium text-ink-100">&gt; $5M</p>
                </div>
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Margin recovery range
                  </p>
                  <p className="font-mono text-xl font-medium text-signal-500">1.8% - 4.6%</p>
                  <p className="mt-1 font-mono text-[10px] text-ink-500">[internal benchmark]</p>
                </div>
                <div className="py-4">
                  <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-ink-500">
                    Mobilization window
                  </p>
                  <p className="font-mono text-xl font-medium text-ink-100">90 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
