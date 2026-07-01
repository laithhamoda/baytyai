'use client';

import { motion } from 'framer-motion';

import { useLeadCapture } from '@/components/forms/lead-capture-provider';

const TRUST_ITEMS = [
  'Verified Stakeholders Only',
  'Global Compliance Ready',
  'Enterprise-Grade Security',
];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  };
}

interface HeroProps {
  overline?: string;
  headline?: string;
  subhead?: string;
}

export default function Hero({
  overline = 'Global Construction Management',
  headline = 'Where Every Project Decision Lives',
  subhead = 'Bayty unifies your entire construction project lifecycle — verified stakeholders, structured approvals, and a trusted marketplace — on one authorised platform.',
}: HeroProps = {}) {
  const { open } = useLeadCapture();
  return (
    <section
      style={{ backgroundColor: '#0A1628' }}
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      {/* Overline */}
      <motion.p
        {...fadeUp(0)}
        style={{
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: '11px',
          letterSpacing: '0.25em',
          color: '#C9A84C',
          textTransform: 'uppercase',
          marginBottom: '32px',
        }}
      >
        {overline}
      </motion.p>

      {/* Top gold rule */}
      <motion.div
        {...fadeUp(0.1)}
        style={{
          width: '60%',
          height: '0.5px',
          backgroundColor: '#C9A84C',
          opacity: 0.4,
          marginBottom: '40px',
        }}
      />

      {/* Headline */}
      <motion.h1
        {...fadeUp(0.2)}
        style={{
          fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
          fontWeight: 300,
          lineHeight: 1.1,
          color: '#F8F6F1',
          maxWidth: '700px',
        }}
        className="text-[44px] md:text-[72px]"
      >
        {headline}
      </motion.h1>

      {/* Sub-headline */}
      <motion.p
        {...fadeUp(0.4)}
        style={{
          fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
          fontWeight: 300,
          fontSize: '18px',
          color: 'rgba(248,246,241,0.65)',
          maxWidth: '560px',
          marginTop: '24px',
          lineHeight: 1.75,
        }}
      >
        {subhead}
      </motion.p>

      {/* Bottom gold rule */}
      <motion.div
        {...fadeUp(0.1)}
        style={{
          width: '60%',
          height: '0.5px',
          backgroundColor: '#C9A84C',
          opacity: 0.4,
          marginTop: '40px',
        }}
      />

      {/* CTAs */}
      <motion.div {...fadeUp(0.6)} className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
        <button type="button" onClick={() => open('private_access')} style={primaryBtn}>
          Request Private Access
        </button>
        <button type="button" onClick={() => open('platform_demo')} style={secondaryBtn}>
          View Platform
        </button>
      </motion.div>

      {/* Trust strip */}
      <motion.div {...fadeUp(0.8)} className="mt-12 flex items-center gap-0">
        {TRUST_ITEMS.map((item, i) => (
          <span key={item} className="flex items-center">
            {i > 0 && (
              <span
                style={{
                  display: 'inline-block',
                  width: '0.5px',
                  height: '12px',
                  backgroundColor: '#C9A84C',
                  opacity: 0.4,
                  margin: '0 20px',
                }}
              />
            )}
            <span
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: '10px',
                letterSpacing: '0.15em',
                color: 'rgba(248,246,241,0.5)',
                textTransform: 'uppercase',
              }}
            >
              {item}
            </span>
          </span>
        ))}
      </motion.div>

      {/* Scroll indicator */}
      <ScrollIndicator />
    </section>
  );
}

function ScrollIndicator() {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.6 }}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1"
    >
      <motion.div
        style={{
          width: '0.5px',
          backgroundColor: '#C9A84C',
          originY: 0,
        }}
        initial={{ height: 0, opacity: 0.3 }}
        animate={{ height: [0, 40, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1.4,
        }}
      />
    </motion.div>
  );
}

const sharedBtn: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontSize: '14px',
  fontWeight: 400,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
  height: '56px',
  padding: '0 32px',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 0,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  transition: 'background-color 0.25s ease, color 0.25s ease',
};

const primaryBtn: React.CSSProperties = {
  ...sharedBtn,
  backgroundColor: '#C9A84C',
  color: '#0A1628',
  border: '0.5px solid #C9A84C',
};

const secondaryBtn: React.CSSProperties = {
  ...sharedBtn,
  backgroundColor: 'transparent',
  color: '#C9A84C',
  border: '0.5px solid #C9A84C',
};
