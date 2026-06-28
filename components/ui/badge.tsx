import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        destructive: 'border-transparent bg-destructive text-destructive-foreground',
        outline: 'text-foreground border-border',
        // Project status badges
        draft: 'border-transparent bg-muted text-muted-foreground',
        submitted: 'border-transparent bg-blue-900/60 text-blue-200',
        under_review: 'border-transparent bg-amber-900/60 text-amber-200',
        information_requested: 'border-transparent bg-orange-900/60 text-orange-200',
        approved: 'border-transparent bg-emerald-900/60 text-emerald-200',
        active: 'border-transparent bg-emerald-800/80 text-emerald-100',
        archived: 'border-transparent bg-muted/50 text-muted-foreground/60',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
