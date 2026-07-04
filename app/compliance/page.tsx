import ComplianceContent from '@/components/compliance/compliance-content';
import { FAQS } from '@/components/compliance/faqs';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance & Data Governance | UAE PDPL · GDPR · Saudi PDPL · ISO 27001 — BaytyAI',
  description:
    "BaytyAI's compliance architecture for global mega-project programs: UAE Federal Decree-Law No. 45/2021 PDPL, GDPR, Saudi Arabia PDPL, multi-jurisdictional data governance, authority matrix workflows, and full audit trail documentation.",
  alternates: { canonical: 'https://www.baytyai.com/compliance' },
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

export default function CompliancePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }}
      />
      <ComplianceContent />
    </>
  );
}
