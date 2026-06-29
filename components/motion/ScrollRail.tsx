'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Fixed vertical scroll-progress rail on the right edge. Purely decorative. */
export default function ScrollRail() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-40 w-px -translate-y-1/2 bg-ink-700 lg:block"
    >
      <motion.div style={{ scaleY, transformOrigin: 'top' }} className="size-full bg-signal-500" />
    </div>
  );
}
