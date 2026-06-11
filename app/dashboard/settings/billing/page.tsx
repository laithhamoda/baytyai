import { getActiveOrg } from '@/lib/auth/tenant';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Billing — Bayty' };

export default async function BillingPage() {
  const active = await getActiveOrg();
  if (!active?.orgId) redirect('/dashboard/setup-org');

  return (
    <div className="max-w-lg">
      <div className="rounded-sm border border-border bg-card p-8 text-center space-y-3">
        <p className="text-sm font-medium text-foreground">Billing & Subscription</p>
        <p className="text-sm text-muted-foreground">
          Stripe billing management is coming soon. To upgrade your plan or discuss
          enterprise pricing, contact us at{' '}
          <a href="mailto:info@baytyai.com" className="text-primary underline-offset-4 hover:underline">
            info@baytyai.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
