'use client';

import { motion } from 'framer-motion';
import {
  ShieldCheck,
  GitBranch,
  FileText,
  Users,
  Briefcase,
  Building2,
  type LucideIcon,
} from 'lucide-react';

interface FeatureTile {
  Icon: LucideIcon;
  name: string;
  description: string;
}

const FEATURE_TILES: FeatureTile[] = [
  {
    Icon: ShieldCheck,
    name: 'Verification Layer',
    description: 'Licence and credential checks for every stakeholder before access is granted.',
  },
  {
    Icon: GitBranch,
    name: 'Approval Workflow',
    description: 'Structured sign-off chains with full audit trails and real-time status tracking.',
  },
  {
    Icon: FileText,
    name: 'Document Hub',
    description:
      'Drawings, contracts, and site records in one versioned, permission-controlled repository.',
  },
  {
    Icon: Users,
    name: 'Team Directory',
    description:
      'Verified profiles for consultants, contractors, and owners across every active project.',
  },
  {
    Icon: Briefcase,
    name: 'Freelancer Marketplace',
    description:
      'Source and engage vetted independent professionals within the GCC construction ecosystem.',
  },
  {
    Icon: Building2,
    name: 'Property Marketplace',
    description:
      'Transact and list verified GCC real estate assets within the same authorised workspace.',
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

export default function FeatureTiles() {
  return (
    <section style={{ backgroundColor: '#0A1628', padding: '120px 0' }}>
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
          The Platform
        </motion.p>

        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: 'clamp(36px, 6vw, 56px)',
            lineHeight: 1.1,
            color: '#F8F6F1',
            maxWidth: '640px',
            marginBottom: '72px',
          }}
        >
          One authorised workspace for every stage
        </motion.h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1px',
            border: '0.5px solid rgba(201,168,76,0.2)',
          }}
        >
          {FEATURE_TILES.map((tile, i) => (
            <motion.div
              key={tile.name}
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
              <tile.Icon size={24} color="#C9A84C" strokeWidth={1.5} aria-hidden />
              <h3
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 500,
                  fontSize: '15px',
                  color: '#F8F6F1',
                  letterSpacing: '0.04em',
                }}
              >
                {tile.name}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: '14px',
                  lineHeight: 1.7,
                  color: 'rgba(248,246,241,0.5)',
                  margin: 0,
                }}
              >
                {tile.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
