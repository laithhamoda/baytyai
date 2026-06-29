'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import Link from 'next/link';
import { useRef } from 'react';

import { usePrefersReducedMotion } from './use-reduced-motion';

interface MagneticButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

/** A link that gently pulls toward the cursor on hover. Static if reduced-motion. */
export default function MagneticButton({ href, children, className = '' }: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  function onMove(e: React.MouseEvent<HTMLAnchorElement>) {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  }
  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div style={{ x: sx, y: sy }} className="inline-block">
      <Link ref={ref} href={href} onMouseMove={onMove} onMouseLeave={reset} className={className}>
        {children}
      </Link>
    </motion.div>
  );
}
