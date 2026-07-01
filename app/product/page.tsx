import ProductClient from './product-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Global Mega Project Control Platform | Approvals, Documents & Risk - BaytyAI',
  },
  description:
    'See BaytyAI for global mega projects: verified stakeholders, approval workflows, document control, claims, variations, risk intelligence, and enterprise governance.',
};

export default function ProductPage() {
  return <ProductClient />;
}
