import ContactClient from './contact-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact — Bayty Enterprise & Government',
  description:
    'Speak with the Bayty enterprise team about corporate, white-label, and government accounts for GCC construction and real estate portfolios.',
};

export default function ContactPage() {
  return <ContactClient />;
}
