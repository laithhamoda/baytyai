import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/server';

import KycClient from './kyc-client';

export const metadata = { title: 'Verify Identity' };

export default async function VerifyIdentityPage() {
  const supabase = await createClient();
  let existingStatus: string | null = null;

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('identity_verifications')
        .select('status')
        .eq('user_id', user.id)
        .maybeSingle();
      existingStatus = (data as { status: string } | null)?.status ?? null;
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-6">
        <h1 className="font-display text-foreground text-2xl font-semibold">
          Identity Verification
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Required before accessing the project dashboard. Your documents are stored securely and
          used only for verification.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full rounded-sm" />}>
        <KycClient existingStatus={existingStatus} />
      </Suspense>
    </div>
  );
}
