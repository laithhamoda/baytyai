import { redirect } from 'next/navigation';

import { acceptInvite } from '@/app/actions/tenancy/accept-invite';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Accept Invitation — Bayty' };

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const supabase = await createClient();
  if (!supabase) redirect('/login');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/invite/${token}`);

  const result = await acceptInvite(token);

  if (!result.success) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center px-4">
        <div className="border-border bg-card w-full max-w-sm space-y-4 rounded-sm border p-8 text-center">
          <h1 className="font-display text-foreground text-xl font-semibold">Invalid invitation</h1>
          <p className="text-muted-foreground text-sm">{result.error}</p>
          <a
            href="/dashboard"
            className="text-primary inline-block text-sm underline-offset-4 hover:underline"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  redirect('/dashboard');
}
