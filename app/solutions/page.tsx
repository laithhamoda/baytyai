import SolutionsClient from './solutions-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute: 'Verified Project Control Platform for Global Mega Project Teams - BaytyAI',
  },
  description:
    'BaytyAI gives each mega-project stakeholder exactly the access and tools their role requires. Role-specific solutions for owners, developers, engineers, consultants, contractors, suppliers, and authorities.',
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
