import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';

import WizardClient from './wizard-client';

export const metadata = { title: 'New Project' };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-foreground text-2xl font-semibold">New Project Intake</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Complete all five steps. Your progress is saved automatically.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-12 w-full rounded-sm" />
            <Skeleton className="h-64 w-full rounded-sm" />
          </div>
        }
      >
        <WizardClient />
      </Suspense>
    </div>
  );
}
