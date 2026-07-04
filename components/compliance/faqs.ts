export const FAQS = [
  {
    q: 'Is BaytyAI UAE PDPL compliant?',
    a: 'BaytyAI is designed to comply with UAE Federal Decree-Law No. 45/2021 on Personal Data Protection. Controls include per-category consent management with timestamp storage, an automated right-to-erasure workflow (30-day deletion on account closure), and a documented 72-hour breach-notification protocol to TDRA. Data-controller registration and full compliance documentation are available to enterprise clients under NDA.',
  },
  {
    q: 'Does BaytyAI comply with GDPR?',
    a: "BaytyAI processes EU data subjects' personal data under GDPR Article 3 territorial scope for programs with EU-resident participants. Controls include documented lawful basis per processing category, Standard Contractual Clauses for international transfers where applicable, an EU data-subject rights mechanism (30-day response), and an EU-based representative. Current EU user data is processed in an AWS Frankfurt (EEA) region, so no cross-border transfer is currently required.",
  },
  {
    q: 'Is a Data Processing Agreement (DPA) available?',
    a: "Yes. BaytyAI provides a standard Data Processing Agreement covering the controller-processor relationship, sub-processor disclosure, security measures, audit rights, breach-notification timelines, and data return/deletion on contract termination. DPAs are available in English and Arabic. Request via enterprise@baytyai.com with subject line 'DPA Request'.",
  },
  {
    q: 'Where is program data stored?',
    a: 'Platform data is stored with our managed database provider in an AWS EU (Frankfurt) region within the EEA by default. UAE data residency (AWS Bahrain) is planned for Month 12, and Saudi Arabia data residency (AWS Riyadh) for 2027 Q3. Custom residency configurations for programs requiring single-jurisdiction isolation are available through enterprise implementation planning.',
  },
  {
    q: "What is BaytyAI's breach-notification process?",
    a: 'BaytyAI maintains a documented incident-response plan reviewed quarterly. On confirmation of a personal-data breach: UAE TDRA notification within 72 hours; affected enterprise clients notified within 24 hours; affected data subjects notified within 10 business days where required. Breach records are retained for 5 years.',
  },
  {
    q: 'Can BaytyAI be used for Saudi Arabia government programs?',
    a: 'BaytyAI is assessing full Saudi PDPL (Royal Decree M/19) compliance for KSA market entry in 2027 Q2, with Saudi data residency (AWS Riyadh) planned for 2027 Q3 to meet NDMO data-localisation preferences for government programs. Enterprise clients requiring KSA government deployment should contact enterprise@baytyai.com to discuss the implementation timeline and interim compliance arrangements.',
  },
  {
    q: 'What rights do data subjects have?',
    a: 'Data subjects whose personal data BaytyAI processes have the right to access their data (copy within 30 days), correction of inaccurate data (within 15 days), erasure on account closure (within 30 days), data portability (structured export on request), and restriction of processing (within 10 days). Requests should be submitted to enterprise@baytyai.com.',
  },
  {
    q: 'How long is audit data retained?',
    a: 'Platform audit logs and verification-document access logs are retained for a minimum of 7 years from creation. Financial and transaction records are retained for 5 years in line with UAE tax-law requirements. Corporate-tier clients can configure extended retention to 15 years for programs with long-term liability tails. Personal data, as distinct from audit metadata, is deleted per the applicable retention schedule on account closure.',
  },
];
