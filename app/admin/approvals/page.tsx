import { listPendingApprovals } from '@/app/actions/approvals/list';

import ApprovalsClient from './approvals-client';

export const metadata = {
  title: { absolute: 'Approvals — BaytyAI Admin' },
  robots: { index: false, follow: false },
};

export default async function AdminApprovalsPage() {
  const approvals = await listPendingApprovals();

  return (
    <div>
      <h1 className="mb-2 font-sans text-3xl font-semibold text-ink-100">Approvals queue</h1>
      <p className="mb-10 font-sans text-sm text-ink-300">
        Pending, approval-gated actions awaiting an admin decision.
      </p>
      <ApprovalsClient initial={approvals} />
    </div>
  );
}
