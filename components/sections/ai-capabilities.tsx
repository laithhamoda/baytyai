'use client';

import { motion } from 'framer-motion';
import { FileSearch, AlertTriangle, Users, MessageSquare, type LucideIcon } from 'lucide-react';

interface Capability {
  Icon: LucideIcon;
  title: string;
  body: string;
}

const CAPABILITIES: Capability[] = [
  {
    Icon: FileSearch,
    title: 'Document Intelligence',
    body: 'Automatically extracts contract party names, deadline dates, revision numbers, and scope descriptions from uploaded PDFs, drawings, and contracts. No manual data entry required.',
  },
  {
    Icon: AlertTriangle,
    title: 'Risk Flagging',
    body: 'Surfaces approval bottlenecks, budget variance signals, and revision loop patterns before they cause project delays. Every risk is flagged to the relevant role without manual monitoring.',
  },
  {
    Icon: Users,
    title: 'Smart Matching',
    body: 'Ranks verified professionals by credentials, regional proximity, project type relevance, and platform ratings for each specific project requirement. Shortlist justification generated automatically.',
  },
  {
    Icon: MessageSquare,
    title: 'Conversational Assistant',
    body: 'Query your entire project portfolio in natural language: pending approvals, expiring licences, overdue sign-offs. Answers are organisation-scoped and logged to the audit trail.',
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

export default function AICapabilities() {
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
          Intelligence Layer
        </motion.p>
        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: 'clamp(32px, 5vw, 48px)',
            lineHeight: 1.1,
            color: '#F8F6F1',
            maxWidth: '640px',
            marginBottom: '72px',
          }}
        >
          The intelligence layer that makes every decision faster
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
          }}
        >
          {CAPABILITIES.map((cap, i) => (
            <motion.div
              key={cap.title}
              {...fadeUpViewport(0.08 * i)}
              style={{
                backgroundColor: '#0F1E35',
                border: '0.5px solid rgba(201,168,76,0.2)',
                padding: '40px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <cap.Icon size={24} color="#C9A84C" strokeWidth={1.5} aria-hidden />
              <h3
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 500,
                  fontSize: '16px',
                  color: '#C9A84C',
                  letterSpacing: '0.02em',
                }}
              >
                {cap.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(248,246,241,0.6)',
                  margin: 0,
                }}
              >
                {cap.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
