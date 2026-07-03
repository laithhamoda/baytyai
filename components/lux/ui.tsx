import Link from 'next/link';

import { cn } from '@/lib/utils';

import type { ReactNode } from 'react';

/**
 * Lux presentational primitives (server components) for the navy + gold brand
 * system. Sharp corners, 0.5px gold borders, DM Mono overlines, Cormorant
 * display headings, DM Sans body.
 */

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('mx-auto w-full max-w-container px-6 md:px-10', className)}>{children}</div>
  );
}

/** 120px vertical rhythm section on the navy field. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('py-24 md:py-section', className)}>
      <Container>{children}</Container>
    </section>
  );
}

/** DM Mono uppercase tracked label. */
export function Overline({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold', className)}>
      {children}
    </p>
  );
}

export function Display({
  children,
  className,
  as: Tag = 'h2',
}: {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <Tag
      className={cn(
        'font-cormorant font-light leading-[1.08] tracking-[-0.01em] text-offwhite',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('font-dmsans text-lg font-light leading-relaxed text-offwhite/70', className)}>
      {children}
    </p>
  );
}

export function GoldRule({ className }: { className?: string }) {
  return <div className={cn('h-px w-16 bg-gold/70', className)} />;
}

/** Primary CTA — gold filled, navy text. */
export function PrimaryCTA({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors duration-200 hover:bg-gold-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Secondary CTA — ghost, 0.5px gold border, gold text. */
export function SecondaryCTA({
  href,
  children,
  className,
  ariaLabel,
}: {
  href: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn(
        'inline-flex items-center justify-center gap-2 border-[0.5px] border-gold bg-transparent px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors duration-200 hover:bg-gold/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Bordered dark card — 0.5px gold border, 2px max radius. */
export function LuxCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'border-[0.5px] border-gold/25 bg-navy-card p-8 transition-colors duration-300 hover:border-gold/50',
        className,
      )}
      style={{ borderRadius: 2 }}
    >
      {children}
    </div>
  );
}
