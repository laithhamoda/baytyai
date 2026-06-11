import { redirect } from 'next/navigation';

import { acceptInvite } from '@/app/actions/tenancy/accept-invite';

export default async function AcceptInvitePage({ params }: { params: { token: string } }) {
  const result = await acceptInvite(params.token);
  if (!result.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="text-center">
          <h1 className="mb-2 font-display text-2xl font-semibold text-foreground">
            Invalid invitation
          </h1>
          <p className="text-sm text-muted-foreground">{result.error}</p>
        </div>
      </div>
    );
  }
  redirect('/dashboard');
}
