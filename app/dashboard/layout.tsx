import { redirect } from 'next/navigation';

import DashboardShell from '@/components/dashboard/shell';
import ImpersonationSwitcher from '@/components/dev/impersonation-switcher';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: { template: '%s | Bayty Dashboard', default: 'Dashboard | Bayty' },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/dashboard');

  // Users without an organization must finish onboarding first (sets stakeholder
  // type so the role-based permissions can resolve). Admins are exempt.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    const { data: membership } = await supabase
      .from('memberships')
      .select('organization_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .maybeSingle();
    if (!membership) redirect('/onboarding');
  }

  return (
    <DashboardShell user={user}>
      {children}
      <ImpersonationSwitcher />
    </DashboardShell>
  );
}
