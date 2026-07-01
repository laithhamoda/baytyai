import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  h2: string;
  id?: string;
  sub?: string;
  align?: 'left' | 'center';
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  h2,
  id,
  sub,
  align = 'left',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className,
      )}
    >
      {eyebrow && (
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-bayty-600">{eyebrow}</p>
      )}
      <h2
        id={id}
        className="font-sans text-display-lg font-semibold text-steel-900 [text-wrap:balance]"
      >
        {h2}
      </h2>
      {sub && (
        <p className="max-w-2xl font-sans text-base font-normal leading-relaxed text-steel-600">
          {sub}
        </p>
      )}
    </div>
  );
}
