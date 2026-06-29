'use client';

import { motion } from 'framer-motion';

import { usePrefersReducedMotion } from './use-reduced-motion';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /** translate distance in px */
  y?: number;
  as?: 'div' | 'section' | 'li';
}

/** Fade + translate into view once. Honors reduced-motion (renders static). */
export default function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = 'div',
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const MotionTag = motion[as];

  if (reduced) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
