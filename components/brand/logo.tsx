import { cn } from '@/lib/utils';

/**
 * BaytyAI brand mark — a capital "B" formed from a connected node graph
 * (a home/organization built from a verified network). Navy mark + wordmark,
 * with "AI" in brand green. Matches the official brand identity.
 *
 * Usage:
 *   <Logo />                 full logo (mark + wordmark) on light backgrounds
 *   <Logo variant="mark" />  just the mark (favicons, app icons)
 *   <Logo tone="light" />    white version for dark/photo backgrounds
 */

type LogoTone = 'brand' | 'light' | 'dark';
type LogoVariant = 'full' | 'mark';

const TONES: Record<LogoTone, { mark: string; node: string; word: string; ai: string }> = {
  brand: { mark: '#17284a', node: '#17284a', word: '#17284a', ai: '#2f7d64' },
  light: { mark: '#ffffff', node: '#bcd0f0', word: '#ffffff', ai: '#6fe0c2' },
  dark: { mark: '#17284a', node: '#17284a', word: '#17284a', ai: '#2f7d64' },
};

// Node coordinates that trace a capital "B" (48×48 viewBox).
const NODES: [number, number][] = [
  [14, 9], // n1 top-left
  [14, 24], // n2 waist-left
  [14, 39], // n3 bottom-left
  [30, 10], // n4 top bump
  [39, 17], // n5 upper-right
  [29, 24], // n6 waist-right
  [39, 31], // n7 lower-right
  [30, 38], // n8 bottom bump
  [22, 24], // hub (center)
];

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
      {/* Network fill (subtle diagonals) */}
      <path
        d="M14 9 L29 24 M30 10 L22 24 M22 24 L29 24 M22 24 L14 24 M14 24 L39 31 M22 24 L30 38"
        stroke={c.mark}
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.45"
      />
      {/* B outline (spine + two loops) */}
      <path
        d="M14 9 L14 24 L14 39 M14 9 L30 10 L39 17 L29 24 L14 24 M29 24 L39 31 L30 38 L14 39"
        stroke={c.mark}
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Nodes */}
      <g fill={c.node}>
        {NODES.slice(0, 8).map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" />
        ))}
      </g>
      {/* Center hub */}
      <circle cx="22" cy="24" r="3" fill={c.mark} />
      <circle cx="22" cy="24" r="1.3" fill="#ffffff" opacity="0.9" />
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
    <span className={cn('inline-flex items-center gap-2', className)}>
      <LogoMark size={size} tone={tone} />
      <span
        className="font-sans text-[1.4rem] font-bold leading-none tracking-tight"
        style={{ color: c.word }}
      >
        Bayty<span style={{ color: c.ai }}>AI</span>
      </span>
    </span>
  );
}
