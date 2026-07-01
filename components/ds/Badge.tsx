import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center border border-bayty-500/30 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-bayty-600',
        className,
      )}
    >
      {children}
    </span>
  );
}
