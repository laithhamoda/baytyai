import { cn } from '@/lib/utils';

/**
 * BaytyAI brand mark — the ornate serif "ai" monogram in brand green, used on
 * its own as the sole identity. The "Bayty" wordmark has been retired: both the
 * `full` and `mark` variants now render the same "ai" mark.
 *
 * To drop in the exact artwork file later, place it at
 * `public/brand/logo-ai.svg` and switch LogoMark to render an <img>; no call
 * site needs to change.
 *
 * Usage:
 *   <Logo />                 "ai" mark (deep green) for light surfaces
 *   <Logo tone="light" />    "ai" mark (bright green) for dark / navy surfaces
 */

type LogoTone = 'brand' | 'light' | 'dark';
type LogoVariant = 'full' | 'mark';

const TONES: Record<LogoTone, { ai: string }> = {
  brand: { ai: '#2f7d64' }, // on white surfaces
  light: { ai: '#6fe0c2' }, // on navy / photos
  dark: { ai: '#2f7d64' },
};

/** The ornate serif "ai" monogram — the brand identity. */
export function LogoMark({
  size = 32,
  tone = 'brand',
  className,
}: {
  size?: number;
  tone?: LogoTone;
  className?: string;
}) {
  const c = TONES[tone];
  return (
    <span
      aria-label="BaytyAI"
      role="img"
      className={cn('inline-block font-display font-semibold italic leading-none', className)}
      style={{ color: c.ai, fontSize: size }}
    >
      ai
    </span>
  );
}

export default function Logo({
  tone = 'brand',
  size = 30,
  className,
}: {
  variant?: LogoVariant;
  tone?: LogoTone;
  size?: number;
  className?: string;
}) {
  return <LogoMark size={size} tone={tone} className={className} />;
}
