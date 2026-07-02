import { cn } from '@/lib/utils';

/**
 * BaytyAI brand mark — a typographic wordmark: "Bayty" + an elegant serif "ai"
 * in brand green. No separate graphic mark; the wordmark is the identity.
 *
 * Usage:
 *   <Logo />                 full wordmark on light surfaces (navy + green)
 *   <Logo tone="light" />    white "Bayty" + bright green "ai" for dark/navy
 *   <Logo variant="mark" />  compact "ai" monogram (favicons, tight spaces)
 */

type LogoTone = 'brand' | 'light' | 'dark';
type LogoVariant = 'full' | 'mark';

const TONES: Record<LogoTone, { word: string; ai: string }> = {
  brand: { word: '#17284a', ai: '#2f7d64' }, // on white surfaces
  light: { word: '#ffffff', ai: '#6fe0c2' }, // on navy / photos
  dark: { word: '#17284a', ai: '#2f7d64' },
};

/** Compact "ai" monogram — the distinctive serif element on its own. */
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
  variant = 'full',
  tone = 'brand',
  size = 30,
  className,
}: {
  variant?: LogoVariant;
  tone?: LogoTone;
  size?: number;
  className?: string;
}) {
  const c = TONES[tone];
  if (variant === 'mark') return <LogoMark size={size} tone={tone} className={className} />;

  return (
    <span className={cn('inline-flex items-baseline', className)} aria-label="BaytyAI">
      <span
        className="font-sans font-bold leading-none tracking-tight"
        style={{ color: c.word, fontSize: size * 0.92 }}
      >
        Bayty
      </span>
      <span
        className="font-display font-semibold italic leading-none"
        style={{ color: c.ai, fontSize: size * 1.02, marginLeft: size * 0.02 }}
      >
        ai
      </span>
    </span>
  );
}
