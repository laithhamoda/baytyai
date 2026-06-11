import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { acceptInvite } from '@/app/actions/tenancy/accept-invite';

export const metadata = { title: 'Accept Invitation — Bayty' };

export default async function AcceptInvitePage({
  params,
}: {
  params: { token: string };
}) {
  const supabase = await createClient();
  if (!supabase) redirect('/login');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/invite/${params.token}`);

  const result = await acceptInvite(params.token);

  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-sm border border-border bg-card p-8 text-center space-y-4">
          <h1 className="font-display text-xl font-semibold text-foreground">
            Invalid invitation
          </h1>
          <p className="text-sm text-muted-foreground">{result.error}</p>
          <a
            href="/dashboard"
            className="inline-block text-sm text-primary underline-offset-4 hover:underline"
          >
            Go to dashboard
          </a>
        </div>
      </div>
    );
  }

  redirect('/dashboard');
}
