export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: 'Is there a free trial?',
    a: 'Yes. Starter and Professional tiers include a 14-day free trial. No credit card required.',
  },
  {
    q: 'Can I switch tiers?',
    a: 'You can upgrade or downgrade at the start of any billing cycle. Upgrades take effect immediately.',
  },
  {
    q: 'Do you support Arabic?',
    a: 'Arabic language UI launches in Phase 4 (Q4 2026) on all tiers. The platform currently operates in English.',
  },
  {
    q: 'Is my data secure?',
    a: "All data is encrypted with AES-256 at rest and TLS 1.3 in transit. Supabase Row Level Security ensures no organisation can access another's data. Mandatory 2FA for Owner and GM roles.",
  },
  {
    q: 'Where is my data stored?',
    a: 'Data is currently stored in EU (Frankfurt). Enterprise deployments can be planned around regional data residency, backup, and compliance requirements.',
  },
  {
    q: 'What is the Corporate tier?',
    a: 'Custom pricing for government entities and large real estate portfolios. Includes white-label deployment, dedicated infrastructure, and a dedicated account manager. Contact enterprise@baytyai.com.',
  },
  {
    q: 'What does API access include?',
    a: 'The Enterprise API covers project management, verification status, document retrieval, and marketplace matching. Full API documentation available on request.',
  },
  {
    q: 'What is the SLA guarantee?',
    a: 'Enterprise tier includes 99.9% uptime SLA with 4-hour support response. Corporate tier includes 99.99% uptime and 1-hour response with a named account manager.',
  },
];
