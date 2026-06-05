export interface FaqItem {
  q: string;
  a: string;
}

export const GEO_FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is Bayty?",
    a: "Bayty is a verified construction management platform for the UAE and GCC. It connects developers, engineers, consultants, and contractors in one authorised workspace covering a 9-stage project lifecycle: verification, structured approvals, document control, and a professional marketplace. Every stakeholder is credential-checked before accessing a live project.",
  },
  {
    q: "Who uses Bayty?",
    a: "Bayty is used by project owners, general managers, design and MEP engineers, consultants, contractors, subcontractors, and freelance professionals across the GCC. Developers and government entities use it to manage portfolios; professionals use it to get verified, discovered, and paid.",
  },
  {
    q: "How does Bayty's verification work?",
    a: "Professionals upload their Emirates ID, trade licence, and professional certificates. Bayty runs a government-linked credential check, typically completed within 24 hours. Once cleared, the user receives a Bayty Verified badge and appears in marketplace searches matching their specialism and location.",
  },
  {
    q: "How much does Bayty cost?",
    a: "Bayty pricing starts at AED 159 per month (Starter), with Professional and Enterprise tiers up to AED 1,999 per month. A 14-day free trial is available with no credit card required. Corporate pricing for government entities and large portfolios is custom.",
  },
  {
    q: "Is Bayty available in the UAE?",
    a: "Yes. Bayty is built specifically for the UAE and wider GCC, including Saudi Arabia, Qatar, Kuwait, Bahrain, and Oman, with regional compliance, GCC-based verification, and an Arabic interface planned for Q4 2026.",
  },
  {
    q: "How is Bayty different from generic project management tools?",
    a: "Unlike generic tools, Bayty enforces identity verification before access, models the GCC's 9-stage construction lifecycle, and includes a verified professional marketplace with escrow payments — purpose-built for the region rather than retrofitted from a Western template.",
  },
  {
    q: "Is my data secure on Bayty?",
    a: "Yes. Data is encrypted with AES-256 at rest and TLS 1.3 in transit. Supabase Row Level Security isolates each organisation's data, and two-factor authentication is mandatory for Owner and GM roles. Bayty is built to UAE PDPL standards.",
  },
  {
    q: "Does Bayty support Arabic?",
    a: "Bayty currently operates in English, with a full Arabic interface launching in Phase 4 (Q4 2026) across all tiers, adapted for GCC business culture rather than literally translated.",
  },
  {
    q: "What is the Bayty marketplace?",
    a: "The Bayty marketplace is a directory of verified construction professionals, searchable by specialism, GCC location, project count, and rating. Owners shortlist and contact directly; professionals receive milestone-based payments through Stripe escrow.",
  },
  {
    q: "How do approvals work in Bayty?",
    a: "Approvals run as a sequential, named sign-off chain. Each step is timestamped and attributed, stalled approvals can be escalated with one click, and every decision is permanently recorded in an audit trail — replacing scattered email and WhatsApp sign-offs.",
  },
];
