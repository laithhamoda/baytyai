import { Suspense } from 'react';
import WizardClient from './wizard-client';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = { title: 'New Project' };

export default function NewProjectPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          New Project Intake
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
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
