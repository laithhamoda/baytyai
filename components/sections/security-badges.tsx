'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Award, Key, type LucideIcon } from 'lucide-react';

interface TrustBadge {
  Icon: LucideIcon;
  label: string;
}

const BADGES: TrustBadge[] = [
  { Icon: Shield, label: 'Global Privacy Ready' },
  { Icon: Lock, label: 'AES-256 Encrypted' },
  { Icon: Award, label: 'SOC 2 Roadmap' },
  { Icon: Key, label: '2FA Mandatory' },
];

export default function SecurityBadges() {
  return (
    <section style={{ backgroundColor: '#0A1628', padding: '24px 24px 96px' }}>
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        {BADGES.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.08 * i, ease: 'easeOut' }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: '0.5px solid rgba(201,168,76,0.4)',
              padding: '12px 18px',
            }}
          >
            <b.Icon size={16} color="#C9A84C" strokeWidth={1.5} aria-hidden />
            <span
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#C9A84C',
              }}
            >
              {b.label}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
