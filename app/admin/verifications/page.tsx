import { listPendingVerifications } from '@/app/actions/verification/admin';

import VerificationsClient from './verifications-client';

export const metadata = {
  title: { absolute: 'Verifications — BaytyAI Admin' },
  robots: { index: false, follow: false },
};

export default async function AdminVerificationsPage() {
  const result = await listPendingVerifications();
  const pending = result.success ? result.data : [];

  return (
    <div>
      <h1 className="mb-2 font-sans text-3xl font-semibold text-ink-100">Verification queue</h1>
      <p className="mb-10 font-sans text-sm text-ink-300">
        Organizations awaiting manual verification. Only verified organizations can transact in the
        marketplace — approval is granted here, by an admin, and never automatically.
      </p>
      <VerificationsClient initial={pending} />
    </div>
  );
}
