'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const VALUES = [
  {
    label: 'Verified',
    title: 'Identity before access',
    body: 'Every professional is checked against government-linked credentials before they touch a live project. Trust is established, not assumed.',
  },
  {
    label: 'Precise',
    title: 'A record for every decision',
    body: 'Every approval, revision, and sign-off is timestamped and named. Nothing lives in a personal inbox or a lost message thread.',
  },
  {
    label: 'Trusted',
    title: 'Built for the Gulf',
    body: 'Designed around GCC compliance, regional regulation, and the way the region actually builds. Not a Western tool retrofitted for the market.',
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  };
}

const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";
const serif = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";
const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
};

export default function AboutClient() {
  return (
    <div style={{ backgroundColor: '#0A1628' }}>
      {/* 1. Hero */}
      <section
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '180px 24px 120px',
          textAlign: 'center',
        }}
      >
        <motion.div
          {...fadeUp(0)}
          style={{
            width: '60px',
            height: '0.5px',
            backgroundColor: '#C9A84C',
            margin: '0 auto 48px',
            opacity: 0.6,
          }}
        />
        <motion.h1
          {...fadeUp(0.08)}
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: 'clamp(34px, 5.5vw, 60px)',
            lineHeight: 1.18,
            color: '#F8F6F1',
          }}
        >
          The Gulf builds the world&rsquo;s most extraordinary buildings. They deserve a platform
          worthy of the ambition behind them.
        </motion.h1>
        <motion.div
          {...fadeUp(0.16)}
          style={{
            width: '60px',
            height: '0.5px',
            backgroundColor: '#C9A84C',
            margin: '48px auto 0',
            opacity: 0.6,
          }}
        />
      </section>

      {/* 2. Mission */}
      <section style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', padding: '120px 24px' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <motion.p
            {...fadeUp(0)}
            style={{ ...mono, fontSize: '11px', color: '#C9A84C', marginBottom: '32px' }}
          >
            Our Mission
          </motion.p>
          <motion.p
            {...fadeUp(0.08)}
            style={{
              fontFamily: serif,
              fontWeight: 300,
              fontSize: 'clamp(22px, 3vw, 30px)',
              lineHeight: 1.55,
              color: '#F8F6F1',
            }}
          >
            Our mission is to make the GCC construction supply chain verifiable, transparent, and
            trusted. Not because it should be — but because every building that fails, every project
            that overruns, and every worker who goes unpaid is the direct consequence of a system
            that runs on informal agreements and unverified identity.
          </motion.p>
        </div>
      </section>

      {/* 3. Values */}
      <section style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', padding: '120px 24px' }}>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          {VALUES.map((v, i) => (
            <motion.div
              key={v.label}
              {...fadeUp(0.08 * i)}
              style={{
                border: '0.5px solid rgba(201,168,76,0.2)',
                padding: '40px 32px',
                backgroundColor: '#0F1E35',
              }}
            >
              <p style={{ ...mono, fontSize: '11px', color: '#C9A84C', marginBottom: '20px' }}>
                {v.label}
              </p>
              <h3
                style={{
                  fontFamily: serif,
                  fontWeight: 600,
                  fontSize: '22px',
                  color: '#F8F6F1',
                  marginBottom: '14px',
                }}
              >
                {v.title}
              </h3>
              <p
                style={{
                  fontFamily: sans,
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(248,246,241,0.6)',
                }}
              >
                {v.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Founding story */}
      <section style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', padding: '120px 24px' }}>
        <motion.div
          {...fadeUp(0)}
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            backgroundColor: '#0F1E35',
            borderLeft: '2px solid #C9A84C',
            padding: '48px 44px',
          }}
        >
          <p
            style={{
              fontFamily: serif,
              fontStyle: 'italic',
              fontWeight: 300,
              fontSize: 'clamp(20px, 2.6vw, 26px)',
              lineHeight: 1.6,
              color: '#F8F6F1',
            }}
          >
            Bayty was founded on a single observation: that the GCC construction industry —
            responsible for the most ambitious built environment on earth — was still being managed
            through WhatsApp groups and scattered email chains. We built the platform we wished
            existed.
          </p>
        </motion.div>
      </section>

      {/* 5. Team */}
      <section style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', padding: '120px 24px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.p
            {...fadeUp(0)}
            style={{ ...mono, fontSize: '11px', color: '#C9A84C', marginBottom: '40px' }}
          >
            The Team
          </motion.p>
          <motion.div
            {...fadeUp(0.08)}
            style={{
              maxWidth: '420px',
              border: '0.5px solid rgba(201,168,76,0.2)',
              padding: '36px 32px',
              backgroundColor: '#0F1E35',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                border: '0.5px solid #C9A84C',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: serif,
                fontSize: '24px',
                color: '#C9A84C',
                marginBottom: '24px',
              }}
            >
              L
            </div>
            <h3
              style={{
                fontFamily: serif,
                fontWeight: 600,
                fontSize: '22px',
                color: '#F8F6F1',
                marginBottom: '4px',
              }}
            >
              Laith Hamoda
            </h3>
            <p style={{ ...mono, fontSize: '10px', color: '#C9A84C', marginBottom: '16px' }}>
              Founder &amp; CEO
            </p>
            <p
              style={{
                fontFamily: sans,
                fontWeight: 300,
                fontSize: '14px',
                lineHeight: 1.7,
                color: 'rgba(248,246,241,0.6)',
                marginBottom: '20px',
              }}
            >
              [Founder bio placeholder — a sentence on background in GCC construction and
              technology. A sentence on the insight that led to Bayty. A sentence on the vision for
              the region&rsquo;s built environment.]
            </p>
            <a
              href="https://linkedin.com/in/laithHamoda"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...mono,
                fontSize: '10px',
                color: '#C9A84C',
                borderBottom: '0.5px solid rgba(201,168,76,0.4)',
                paddingBottom: '2px',
              }}
            >
              LinkedIn ↗
              <span
                style={{
                  position: 'absolute',
                  width: 1,
                  height: 1,
                  padding: 0,
                  margin: -1,
                  overflow: 'hidden',
                  clip: 'rect(0,0,0,0)',
                  whiteSpace: 'nowrap',
                  border: 0,
                }}
              >
                {' '}
                (opens in a new tab)
              </span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* 6. CTAs */}
      <section
        style={{ borderTop: '0.5px solid rgba(201,168,76,0.15)', padding: '100px 24px 120px' }}
      >
        <motion.div
          {...fadeUp(0)}
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Link
            href="/request-access"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '56px',
              padding: '0 36px',
              backgroundColor: '#C9A84C',
              color: '#0A1628',
              fontFamily: sans,
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 0,
            }}
          >
            Request Private Access →
          </Link>
          <a
            href="mailto:investor@baytyai.com"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              height: '56px',
              padding: '0 36px',
              backgroundColor: 'transparent',
              color: '#C9A84C',
              border: '0.5px solid #C9A84C',
              fontFamily: sans,
              fontWeight: 400,
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              borderRadius: 0,
            }}
          >
            investor@baytyai.com
          </a>
        </motion.div>
      </section>
    </div>
  );
}
