'use client';

import { motion } from 'framer-motion';
import { Shield, Clock, CreditCard, type LucideIcon } from 'lucide-react';

import { useLeadCapture } from '@/components/forms/lead-capture-provider';

interface Step {
  Icon: LucideIcon;
  body: string;
}

const STEPS: Step[] = [
  { Icon: Shield, body: 'Upload your Emirates ID, trade licence, and professional certificates.' },
  { Icon: Clock, body: 'Pass 24-hour Bayty verification. Receive your verified badge.' },
  {
    Icon: CreditCard,
    body: 'Appear in every search matching your specialism. Payments protected by escrow.',
  },
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  };
}

export default function MarketplaceJoin() {
  const { open } = useLeadCapture();
  return (
    <section
      style={{
        backgroundColor: '#0A1628',
        padding: '120px 0',
        borderTop: '0.5px solid rgba(201,168,76,0.15)',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <motion.p
          {...fadeUpViewport(0)}
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: '11px',
            letterSpacing: '0.25em',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '24px',
          }}
        >
          Join the Marketplace
        </motion.p>
        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: 'clamp(32px, 5vw, 48px)',
            lineHeight: 1.12,
            color: '#F8F6F1',
            maxWidth: '720px',
            marginBottom: '72px',
          }}
        >
          Already working in construction? Get verified. Get found. Get selected.
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '24px',
            marginBottom: '56px',
          }}
        >
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              {...fadeUpViewport(0.08 * i)}
              style={{
                border: '0.5px solid rgba(201,168,76,0.25)',
                padding: '36px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                    fontSize: '12px',
                    color: '#C9A84C',
                  }}
                >
                  0{i + 1}
                </span>
                <step.Icon size={22} color="#C9A84C" strokeWidth={1.5} aria-hidden />
              </div>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: '15px',
                  lineHeight: 1.65,
                  color: 'rgba(248,246,241,0.7)',
                }}
              >
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div {...fadeUpViewport(0.3)}>
          <button
            type="button"
            onClick={() => open('verified_professional')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '56px',
              padding: '0 36px',
              backgroundColor: '#C9A84C',
              color: '#0A1628',
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 0,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Join as a verified professional →
          </button>
        </motion.div>
      </div>
    </section>
  );
}
