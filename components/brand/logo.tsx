import { cn } from '@/lib/utils';

/**
 * BaytyAI brand mark — a hexagonal node graph (a "home" formed from a connected
 * network), expressing a verified, interconnected construction marketplace.
 *
 * Usage:
 *   <Logo />                         full logo (mark + wordmark), brand blue
 *   <Logo variant="mark" />          just the mark (favicons, app icons)
 *   <Logo tone="light" />            white version for dark/photo backgrounds
 */

type LogoTone = 'brand' | 'light' | 'dark';
type LogoVariant = 'full' | 'mark';

const TONES: Record<LogoTone, { mark: string; node: string; word: string; ai: string }> = {
  brand: { mark: '#0052cc', node: '#3377db', word: '#111827', ai: '#0052cc' },
  light: { mark: '#ffffff', node: '#b9d6fb', word: '#ffffff', ai: '#7db0f3' },
  dark: { mark: '#111827', node: '#374151', word: '#111827', ai: '#0052cc' },
};

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
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="BaytyAI"
      className={className}
    >
      {/* edges */}
      <g stroke={c.mark} strokeWidth="2" strokeLinecap="round" opacity="0.9">
        <path d="M24 7 L39 15.5 M39 15.5 L39 32.5 M39 32.5 L24 41 M24 41 L9 32.5 M9 32.5 L9 15.5 M9 15.5 L24 7" />
        <path d="M24 7 L24 24 M39 15.5 L24 24 M39 32.5 L24 24 M24 41 L24 24 M9 32.5 L24 24 M9 15.5 L24 24" />
      </g>
      {/* outer nodes */}
      <g fill={c.node}>
        <circle cx="24" cy="7" r="3" />
        <circle cx="39" cy="15.5" r="3" />
        <circle cx="39" cy="32.5" r="3" />
        <circle cx="24" cy="41" r="3" />
        <circle cx="9" cy="32.5" r="3" />
        <circle cx="9" cy="15.5" r="3" />
      </g>
      {/* center node */}
      <circle cx="24" cy="24" r="4.5" fill={c.mark} />
      <circle cx="24" cy="24" r="2" fill="#ffffff" opacity="0.95" />
    </svg>
  );
}

export default function Logo({
  variant = 'full',
  tone = 'brand',
  size = 32,
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
    <span className={cn('inline-flex items-center gap-2.5', className)}>
      <LogoMark size={size} tone={tone} />
      <span
        className="font-display text-[1.35rem] font-bold leading-none tracking-tight"
        style={{ color: c.word }}
      >
        Bayty<span style={{ color: c.ai }}>AI</span>
      </span>
    </span>
  );
}
