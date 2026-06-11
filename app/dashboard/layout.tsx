import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/dashboard/shell';

export const metadata = {
  title: { template: '%s | Bayty Dashboard', default: 'Dashboard | Bayty' },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  if (!supabase) redirect('/sign-in');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/sign-in');

  return <DashboardShell user={user}>{children}</DashboardShell>;
}
