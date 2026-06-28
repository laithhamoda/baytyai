import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-signal-500/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-signal-500',
        className,
      )}
    >
      {children}
    </span>
  );
}
