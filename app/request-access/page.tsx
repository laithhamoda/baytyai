import DemoClient from '../demo/demo-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Request Access - BaytyAI Global Project Control Platform' },
  description:
    'Request access to BaytyAI. Available to verified owners, developers, consultants, contractors, subcontractors, and suppliers on global mega projects.',
};

export default function RequestAccessPage() {
  return <DemoClient />;
}
