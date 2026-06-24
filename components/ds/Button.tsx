import { cn } from '@/lib/utils';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'focus-visible:outline-offset-3 inline-flex items-center justify-center font-sans font-medium tracking-wide transition-colors focus-visible:outline-2 focus-visible:outline-signal-500 disabled:pointer-events-none disabled:opacity-50',
        {
          'bg-signal-500 text-ink-950 hover:bg-signal-600': variant === 'primary',
          'border border-signal-500 bg-transparent text-signal-500 hover:bg-signal-500 hover:text-ink-950':
            variant === 'secondary',
          'bg-transparent text-ink-100 hover:text-signal-500': variant === 'ghost',
        },
        {
          'px-5 py-2.5 text-sm': size === 'md',
          'px-8 py-4 text-base': size === 'lg',
        },
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
