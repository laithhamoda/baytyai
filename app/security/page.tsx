import { FAQS } from '@/components/security/faqs';
import SecurityContent from '@/components/security/security-content';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Enterprise Security | AES-256 · TLS 1.3 · SOC 2 Roadmap · PDPL — BaytyAI',
  description:
    "BaytyAI's enterprise security architecture: AES-256 encryption at rest, TLS 1.3 in transit, Supabase Row Level Security, passwordless authentication with MFA on the roadmap, UAE PDPL compliance, and a dated SOC 2 Type II roadmap for government and enterprise mega-project programs.",
  alternates: { canonical: 'https://www.baytyai.com/security' },
};

const FAQ_JSONLD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function SecurityPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <SecurityContent />
    </>
  );
}
