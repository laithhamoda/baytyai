import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import CreateOrgForm from './create-org-form';

export default async function SetupOrgPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/login');
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  // Check if already in an org
  const { data: membership } = await supabase
    .from('memberships')
    .select('id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .single();
  if (membership) redirect('/dashboard');
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <h1 className="mb-2 font-display text-2xl font-semibold text-foreground">
          Create your organization
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          Your organization is the workspace for your team and projects.
        </p>
        <CreateOrgForm />
      </div>
    </div>
  );
}
