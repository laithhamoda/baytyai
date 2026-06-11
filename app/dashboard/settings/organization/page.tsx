import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getActiveOrg } from '@/lib/auth/tenant';

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
    free: 'Free', pro: 'Pro', business: 'Business', enterprise: 'Enterprise',
  };

  return (
    <div className="max-w-lg space-y-6">
      <div className="rounded-sm border border-border bg-card divide-y divide-border">
        <Row label="Organization name" value={org?.name ?? '—'} />
        <Row label="Slug" value={org?.slug ?? '—'} mono />
        <Row
          label="Plan"
          value={
            <span className="inline-flex items-center rounded-sm bg-primary/10 px-2 py-0.5 text-xs font-mono uppercase tracking-widest text-primary">
              {TIER_LABEL[org?.tier ?? 'free'] ?? org?.tier}
            </span>
          }
        />
        <Row
          label="Member since"
          value={org?.created_at ? new Date(org.created_at).toLocaleDateString('en-AE', { dateStyle: 'medium' }) : '—'}
        />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      {typeof value === 'string' ? (
        <p className={`text-sm text-foreground ${mono ? 'font-mono' : 'font-medium'}`}>{value}</p>
      ) : (
        value
      )}
    </div>
  );
}
