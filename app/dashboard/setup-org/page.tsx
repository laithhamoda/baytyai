import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import CreateOrgForm from './create-org-form';

export const metadata = { title: 'Create Organization — Bayty' };

export default async function SetupOrgPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/login');

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: membership } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle();

  if (membership) redirect('/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="font-display text-3xl font-semibold text-primary tracking-wide">
            Bayty
          </span>
        </div>
        <h1 className="mb-2 font-display text-2xl font-semibold text-foreground">
          Create your organization
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Your organization is the workspace for your team and projects on BaytyAI.
        </p>
        <CreateOrgForm />
      </div>
    </div>
  );
}
