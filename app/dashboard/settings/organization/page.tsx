import { redirect } from 'next/navigation';

import { getActiveOrg } from '@/lib/auth/tenant';
import { createClient } from '@/lib/supabase/server';

export default async function OrganizationSettingsPage() {
  const active = await getActiveOrg();
  if (!active?.orgId) redirect('/dashboard/setup-org');
  const supabase = await createClient();
  const { data: org } = await supabase!
    .from('organizations')
    .select('name,slug,tier,created_at')
    .eq('id', active.orgId)
    .single();

  return (
    <div className="max-w-lg space-y-6">
      <div className="space-y-4 rounded-sm border border-border bg-card p-6">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">
            Organization name
          </p>
          <p className="text-sm font-medium text-foreground">{org?.name ?? '—'}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Slug</p>
          <p className="font-mono text-sm text-foreground">{org?.slug ?? '—'}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-muted-foreground">Plan</p>
          <span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 font-mono text-xs uppercase tracking-widest text-primary">
            {org?.tier ?? 'free'}
          </span>
        </div>
      </div>
    </div>
  );
}
