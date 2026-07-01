import { listAccessRequests } from '@/app/actions/access/admin';

import AccessRequestsClient from './access-requests-client';

export const metadata = {
  title: { absolute: 'Access Requests — BaytyAI Admin' },
  robots: { index: false, follow: false },
};

export default async function AdminAccessRequestsPage() {
  const result = await listAccessRequests();
  const requests = result.success ? result.data : [];

  return (
    <div>
      <h1 className="mb-2 font-sans text-3xl font-semibold text-steel-900">Access requests</h1>
      <p className="mb-10 font-sans text-sm text-steel-600">
        Enterprise applications from prospective organizations. Review each one and invite or
        decline — BaytyAI is granted by invitation only.
      </p>
      <AccessRequestsClient initial={requests} />
    </div>
  );
}
