import AboutClient from './about-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Bayty — Modernising Construction in the Gulf',
  description:
    'Bayty was founded on a single observation: that the GCC construction industry was still being managed through WhatsApp groups and scattered email chains. We built the platform we wished existed.',
};

export default function AboutPage() {
  return <AboutClient />;
}
