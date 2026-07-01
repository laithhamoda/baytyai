import ContactClient from './contact-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact - BaytyAI Enterprise & Government',
  description:
    'Speak with the BaytyAI enterprise team about global corporate, white-label, developer, contractor, and government accounts for construction and infrastructure portfolios.',
};

export default function ContactPage() {
  return <ContactClient />;
}
