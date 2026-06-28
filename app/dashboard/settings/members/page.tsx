import { redirect } from 'next/navigation';

import { getActiveOrg } from '@/lib/auth/tenant';
import { getMembers } from '@/lib/services/tenancy';

import MembersClient from './members-client';

export const metadata = { title: 'Members — Bayty' };

export default async function MembersPage() {
  const active = await getActiveOrg();
  if (!active?.orgId) redirect('/dashboard/setup-org');

  const members = await getMembers(active.orgId);

  return <MembersClient members={members} activeRole={active.orgRole} />;
}
