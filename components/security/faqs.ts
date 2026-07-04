export const FAQS = [
  {
    q: 'Is BaytyAI SOC 2 certified?',
    a: 'BaytyAI is not currently SOC 2 Type II certified. Our SOC 2 Type II audit is scheduled for 2027 Q2, following a six-month evidence-collection period beginning 2026 Q4. The full roadmap is published on this page. Enterprise clients requiring SOC 2 certification before procurement should contact enterprise@baytyai.com to discuss interim security controls and documentation.',
  },
  {
    q: 'What encryption standard is used for data at rest?',
    a: 'AES-256 is applied to database fields containing personal data, identity documents, and financial records. Verification documents in Supabase Storage are encrypted at the bucket level with AES-256. Column-level encryption of national ID references, payment identifiers, and verification-document references is on the roadmap as an additional layer.',
  },
  {
    q: 'What TLS version is enforced?',
    a: 'TLS 1.3 is negotiated on all connections where the client supports it. Legacy TLS 1.0 and 1.1 are not offered at the Vercel and Supabase edge. HSTS is enforced with a one-year max-age and preload.',
  },
  {
    q: 'How is multi-tenant data isolation enforced?',
    a: 'Data isolation is enforced at the PostgreSQL query level via Supabase Row Level Security. Every query is filtered by the authenticated user’s organisation before execution, so even a compromised application session cannot access another organisation’s data — the database rejects the query before returning results. This is database-layer isolation, not application-layer filtering.',
  },
  {
    q: 'Where is customer data stored?',
    a: 'Platform data is stored with our managed database provider in an EU (Frankfurt) region by default. UAE-region residency (Bahrain) is planned for Month 12; Saudi Arabia-region residency (Riyadh) is planned for 2027 Q3. Enterprise programs requiring specific data residency should contact enterprise@baytyai.com.',
  },
  {
    q: 'What is the policy for verification-document retention and deletion?',
    a: 'Verification documents are retained for the active account lifecycle plus 90 days post-closure. On account closure, personal data is deleted within 30 days per UAE PDPL Article 14. Deletion is automated and generates a deletion-confirmation record; binary documents are hard-deleted from storage and metadata is anonymised.',
  },
  {
    q: 'Is 2FA mandatory?',
    a: 'Sign-in is passwordless today via email one-time-passcode, so there are no reusable passwords to phish. Mandatory TOTP-authenticator MFA for Owner, Administrator, and leadership roles is on the near-term roadmap; SMS 2FA will not be offered due to SIM-swap risk. Contact enterprise@baytyai.com for the current MFA status on your program.',
  },
  {
    q: 'What penetration testing has been conducted?',
    a: 'A third-party penetration test is planned prior to Enterprise client onboarding and annually thereafter, with automated security testing in the interim. Results and remediation reports will be available to enterprise clients under NDA. Contact enterprise@baytyai.com for current penetration-test documentation.',
  },
];
