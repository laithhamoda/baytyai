import { redirect } from 'next/navigation';

import { getActiveOrg } from '@/lib/auth/tenant';
import { createClient } from '@/lib/supabase/server';

export const metadata = { title: 'Organization Settings — Bayty' };

export default async function OrganizationSettingsPage() {
  const active = await getActiveOrg();
  if (!active?.orgId) redirect('/dashboard/setup-org');

  const supabase = await createClient();
  const { data: org } = await supabase!
    .from('organizations')
    .select('name, slug, tier, created_at')
    .eq('id', active.orgId)
    .single();

  const TIER_LABEL: Record<string, string> = {
    free: 'Free',
    pro: 'Pro',
    business: 'Business',
    enterprise: 'Enterprise',
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="border-border bg-card divide-border divide-y rounded-sm border">
        <Row label="Organization name" value={org?.name ?? '—'} />
        <Row label="Slug" value={org?.slug ?? '—'} mono />
        <Row
          label="Plan"
          value={
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-xs uppercase tracking-widest">
              {TIER_LABEL[org?.tier ?? 'free'] ?? org?.tier}
            </span>
          }
        />
        <Row
          label="Member since"
          value={
            org?.created_at
              ? new Date(org.created_at).toLocaleDateString('en-AE', { dateStyle: 'medium' })
              : '—'
          }
        />
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <p className="text-muted-foreground text-xs uppercase tracking-wider">{label}</p>
      {typeof value === 'string' ? (
        <p className={`text-foreground text-sm ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
      ) : (
        value
      )}
    </div>
  );
}
