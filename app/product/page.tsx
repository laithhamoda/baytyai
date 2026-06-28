import ProductClient from './product-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    absolute:
      'Construction Project Management Platform | Approval Workflows & Document Hub — Bayty',
  },
  description:
    'See the Bayty platform — verified stakeholders, approval workflows, document management, and professional marketplace for GCC construction.',
};

export default function ProductPage() {
  return <ProductClient />;
}
