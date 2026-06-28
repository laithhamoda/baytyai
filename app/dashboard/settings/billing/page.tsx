import { redirect } from 'next/navigation';

import { getActiveOrg } from '@/lib/auth/tenant';

export const metadata = { title: 'Billing — Bayty' };

export default async function BillingPage() {
  const active = await getActiveOrg();
  if (!active?.orgId) redirect('/dashboard/setup-org');

  return (
    <div className="max-w-lg">
      <div className="border-border bg-card space-y-3 rounded-sm border p-8 text-center">
        <p className="text-foreground text-sm font-medium">Billing & Subscription</p>
        <p className="text-muted-foreground text-sm">
          Stripe billing management is coming soon. To upgrade your plan or discuss enterprise
          pricing, contact us at{' '}
          <a
            href="mailto:info@baytyai.com"
            className="text-primary underline-offset-4 hover:underline"
          >
            info@baytyai.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
