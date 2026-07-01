import DemoClient from './demo-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Request Private Access - BaytyAI',
  description:
    'Request a private introduction to BaytyAI. Available to verified construction, infrastructure, real estate, and government-backed project teams worldwide.',
};

export default function DemoPage() {
  return <DemoClient />;
}
