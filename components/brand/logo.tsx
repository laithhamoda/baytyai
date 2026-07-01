import Image from 'next/image';

import { cn } from '@/lib/utils';

type LogoTone = 'brand' | 'light' | 'dark';
type LogoVariant = 'full' | 'mark';

const FULL_LOGO_RATIO = 1066 / 323;
const MARK_LOGO_RATIO = 230 / 323;

function logoPlate(tone: LogoTone, compact = false) {
  if (tone === 'light') return 'bg-transparent';
  return compact ? 'bg-[#17284a] p-1.5' : 'bg-[#050608] px-3 py-2';
}

export function LogoMark({
  size = 32,
  tone = 'brand',
  className,
}: {
  size?: number;
  tone?: LogoTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center overflow-hidden rounded-sm',
        logoPlate(tone, true),
        className,
      )}
      style={{
        height: size,
        width: Math.round(size * MARK_LOGO_RATIO) + (tone === 'light' ? 0 : 12),
      }}
    >
      <Image
        src="/logo-mark.png"
        alt="BaytyAI"
        width={230}
        height={323}
        className="h-full w-auto object-contain"
        priority
      />
    </span>
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
  if (variant === 'mark') return <LogoMark size={size} tone={tone} className={className} />;

  return (
    <span
      className={cn(
        'inline-flex items-center overflow-hidden rounded-sm',
        logoPlate(tone),
        className,
      )}
      style={{
        height: tone === 'light' ? size : size + 16,
        width: Math.round(size * FULL_LOGO_RATIO) + (tone === 'light' ? 0 : 24),
      }}
    >
      <Image
        src="/logo.png"
        alt="BaytyAI"
        width={1066}
        height={323}
        className="h-full w-auto object-contain"
        priority
      />
    </span>
  );
}
