'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  Compass,
  HardHat,
  Wrench,
  Package,
  FileText,
  GitCompare,
  Award,
  Search,
  Send,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * "Which one are you?" — an auto-playing, GIF-like role journey.
 * Scanners see, in 3 icons, exactly what they'd do on BaytyAI. Auto-advances
 * through the roles; clicking a role pins it. Respects reduced-motion.
 */

type Step = { icon: React.ElementType; label: string };
type Role = { key: string; label: string; icon: React.ElementType; blurb: string; steps: Step[] };

const ROLES: Role[] = [
  {
    key: 'client',
    label: 'Client / Owner',
    icon: Building2,
    blurb: 'You have a project and need the right people.',
    steps: [
      { icon: FileText, label: 'Post your inquiry' },
      { icon: GitCompare, label: 'Compare verified quotes' },
      { icon: Award, label: 'Award & track' },
    ],
  },
  {
    key: 'consultant',
    label: 'Consultant',
    icon: Compass,
    blurb: 'You win work on merit, not connections.',
    steps: [
      { icon: Search, label: 'Get discovered' },
      { icon: Send, label: 'Submit your proposal' },
      { icon: BadgeCheck, label: 'Get selected transparently' },
    ],
  },
  {
    key: 'contractor',
    label: 'Contractor',
    icon: HardHat,
    blurb: 'You bid on real, structured scopes.',
    steps: [
      { icon: Search, label: 'Browse open demand' },
      { icon: Send, label: 'Send your quotation' },
      { icon: Award, label: 'Win & manage the job' },
    ],
  },
  {
    key: 'subcontractor',
    label: 'Subcontractor',
    icon: Wrench,
    blurb: 'You get found by verified main contractors.',
    steps: [
      { icon: BadgeCheck, label: 'Get verified' },
      { icon: Search, label: 'Get matched to scopes' },
      { icon: Send, label: 'Quote & deliver' },
    ],
  },
  {
    key: 'supplier',
    label: 'Supplier',
    icon: Package,
    blurb: 'You quote against real buyer demand.',
    steps: [
      { icon: Search, label: 'See live demand' },
      { icon: Send, label: 'Send your offer' },
      { icon: Award, label: 'Supply verified buyers' },
    ],
  },
];

export default function A1RoleJourneys() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  // Auto-advance like a looping GIF, unless the user is hovering/interacting.
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % ROLES.length), 3200);
    return () => clearInterval(t);
  }, [paused]);

  const role = ROLES[active];

  return (
    <section className="py-24">
      <div className="mx-auto max-w-container px-6 md:px-12">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-sans text-sm font-semibold uppercase tracking-widest text-[#6fe0c2]">
            Is BaytyAI for you?
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold text-white">
            Pick your role — see what you’d do
          </h2>
          <p className="mt-4 font-sans text-lg text-white/70">
            Three steps. That’s it. Tap the role that sounds like you.
          </p>
        </div>

        {/* Role chips */}
        <div
          className="mt-10 flex flex-wrap justify-center gap-2.5"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {ROLES.map((r, i) => {
            const Icon = r.icon;
            const on = i === active;
            return (
              <button
                key={r.key}
                type="button"
                onClick={() => {
                  setActive(i);
                  setPaused(true);
                }}
                className={`flex items-center gap-2 rounded-pill border px-4 py-2 font-sans text-sm font-medium transition-colors ${
                  on
                    ? 'border-bayty-500 bg-bayty-500 text-white shadow-a1-glow'
                    : 'border-white/15 bg-white/5 text-white/70 hover:border-white/30'
                }`}
              >
                <Icon size={16} />
                {r.label}
              </button>
            );
          })}
        </div>

        {/* Animated journey */}
        <div
          className="mx-auto mt-12 max-w-4xl rounded-card border border-white/10 bg-white/5 p-8 md:p-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={role.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
            >
              <p className="mb-8 text-center font-sans text-base text-white/70">{role.blurb}</p>
              <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-center">
                {role.steps.map((s, idx) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="flex items-center gap-4 md:flex-col md:gap-3">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.15 + idx * 0.25, type: 'spring', stiffness: 200 }}
                        className="flex size-16 shrink-0 items-center justify-center rounded-card bg-white/10 text-[#6fe0c2] md:size-20"
                      >
                        <Icon size={30} />
                      </motion.div>
                      <div className="md:mt-1 md:w-32 md:text-center">
                        <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[#6fe0c2]">
                          Step {idx + 1}
                        </span>
                        <p className="font-sans text-sm font-medium text-white">{s.label}</p>
                      </div>
                      {idx < role.steps.length - 1 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + idx * 0.25 }}
                          className="text-white/25 md:mx-1"
                        >
                          <ArrowRight size={22} className="hidden md:block" />
                          <ArrowRight size={18} className="rotate-90 md:hidden" />
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex flex-col items-center gap-3">
            <Link
              href="/access"
              className="rounded-pill bg-orange-400 px-8 py-3.5 font-sans text-sm font-semibold text-white shadow-a1-glow transition-colors hover:bg-orange-600"
            >
              Request access as {role.label} →
            </Link>
            <span className="font-sans text-xs text-white/55">
              By invitation · verified organizations only
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
