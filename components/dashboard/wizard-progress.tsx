'use client';

import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';

const STEPS = [
  { n: 1, label: 'Organization' },
  { n: 2, label: 'Project Profile' },
  { n: 3, label: 'Scope' },
  { n: 4, label: 'Documents' },
  { n: 5, label: 'Review' },
];

export default function WizardProgress({ current }: { current: number }) {
  return (
    <nav aria-label="Wizard steps" className="mb-8">
      <ol className="flex items-center gap-0">
        {STEPS.map((step, idx) => {
          const done = step.n < current;
          const active = step.n === current;
          const upcoming = step.n > current;

          return (
            <li key={step.n} className="flex flex-1 items-center">
              {/* Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors',
                    done && 'border-primary bg-primary text-primary-foreground',
                    active && 'border-primary bg-primary/10 text-primary',
                    upcoming && 'border-border bg-muted/30 text-muted-foreground',
                  )}
                >
                  {done ? <Check size={14} strokeWidth={2.5} /> : step.n}
                </div>
                <span
                  className={cn(
                    'mt-1.5 hidden text-center text-[11px] leading-tight sm:block',
                    active ? 'text-primary font-medium' : 'text-muted-foreground',
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector */}
              {idx < STEPS.length - 1 && (
                <div
                  className={cn(
                    'mx-1 h-0.5 flex-1 transition-colors',
                    done ? 'bg-primary' : 'bg-border',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
