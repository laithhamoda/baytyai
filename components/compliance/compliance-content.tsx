'use client';

import {
  Scale,
  Globe,
  FileText,
  Users,
  GitBranch,
  Award,
  AlertTriangle,
  Shield,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';

import { FAQS } from '@/components/compliance/faqs';
import { LuxShell } from '@/components/lux/chrome';
import { FadeUp, Stagger, StaggerItem } from '@/components/lux/motion';

import type { LucideIcon } from 'lucide-react';

/* ── data ───────────────────────────────────────────────────────── */

const REGULATIONS: {
  label: string;
  regulation: string;
  obligations: string[];
}[] = [
  {
    label: 'United Arab Emirates',
    regulation: 'Federal Decree-Law No. 45/2021 — Personal Data Protection Law (PDPL)',
    obligations: [
      'Data controller registration with TDRA — maintained for controller activities',
      'Explicit consent management — per-category consent with timestamp storage',
      'Right to erasure within 30 days — automated deletion workflow on account closure',
      '72-hour breach notification to TDRA — documented incident-response plan',
    ],
  },
  {
    label: 'European Union',
    regulation: 'Regulation (EU) 2016/679 — General Data Protection Regulation (GDPR)',
    obligations: [
      'Lawful basis documented per category (contract performance, legitimate interest)',
      'Standard Contractual Clauses (SCCs) for transfers outside the EEA — available on request',
      'Right to data portability — structured data export on written request',
      'EU representative designated for EU data-subject correspondence',
    ],
  },
  {
    label: 'United Kingdom',
    regulation: 'UK GDPR + Data Protection Act 2018',
    obligations: [
      'UK adequacy framework applied — transfers governed by UK SCCs (IDTA) where required',
      'ICO registration maintained for controller activities involving UK data subjects',
      'Data-subject rights (access, rectification, erasure, portability) via enterprise@baytyai.com',
      'Privacy notices reviewed for UK-specific disclosure requirements',
    ],
  },
  {
    label: 'Kingdom of Saudi Arabia',
    regulation: 'Personal Data Protection Law — Royal Decree M/19 (PDPL)',
    obligations: [
      'Saudi PDPL compliance assessment for KSA market entry (2027 Q2)',
      'Data residency planning for KSA programs — AWS Riyadh (2027 Q3)',
      'NDMO (National Data Management Office) framework incorporated',
      'Arabic-language privacy notices and consent forms for KSA onboarding',
    ],
  },
  {
    label: 'Singapore',
    regulation: 'Personal Data Protection Act 2012 (PDPA) — as amended 2020',
    obligations: [
      'Mandatory data-breach notification — within 3 days of assessment',
      'Do Not Call provisions — no unsolicited marketing to Singapore numbers',
      'Data Protection Officer designated for Singapore operations',
      'PDPA advisory guidelines reviewed for construction-sector data categories',
    ],
  },
  {
    label: 'International Programs',
    regulation: 'Cross-jurisdictional frameworks for multi-national delivery programs',
    obligations: [
      'Data Processing Agreement (DPA) in English and Arabic for all enterprise programs',
      'Sub-processor disclosure list maintained and updated quarterly',
      'Jurisdiction-specific consent flows configurable per program deployment',
      'Legal transfer mechanisms documented for all cross-border data flows',
    ],
  },
];

const CONTROLLER = [
  'User registration and account-management data',
  'Identity verification documents (Emirates IDs, trade licences)',
  'Platform usage analytics (anonymised)',
  'Billing and subscription metadata',
];
const PROCESSOR = [
  'Project records created by your organisation',
  'Approval histories and decision records',
  'Commercial documents, RFQs, and award records',
  'Contractor and stakeholder data input by your team',
];

const AUDIT: { icon: LucideIcon; label: string; desc: string }[] = [
  {
    icon: FileText,
    label: 'Approval records',
    desc: 'Every approval, rejection, and escalation is recorded with approving-party identity, timestamp, decision basis, and the version of documentation reviewed. Immutable.',
  },
  {
    icon: Users,
    label: 'Access history',
    desc: 'Every access to sensitive workflows, verification documents, and restricted data is logged with user identity, organisation, timestamp, and access method.',
  },
  {
    icon: GitBranch,
    label: 'Document version history',
    desc: 'Every upload, revision, and supersession is recorded with uploader identity, version number, and timestamp. Current version and full history are always accessible.',
  },
  {
    icon: Award,
    label: 'Award and procurement records',
    desc: 'Every RFQ, submission, evaluation, and award decision is recorded — with evaluation criteria, commercial values, and award rationale.',
  },
  {
    icon: AlertTriangle,
    label: 'Variation and claims records',
    desc: 'Every variation instruction, scope change, and claims submission is recorded with originating instruction, scope description, commercial value, and approval history.',
  },
  {
    icon: Shield,
    label: 'Admin and access management',
    desc: 'Every invitation, permission change, role assignment, and deactivation is logged — a complete record of who had access to what, and when.',
  },
];

const AUTHORITY = [
  {
    title: 'Payment certificate approval',
    body: "Only parties with explicit payment authority in the programme's authority matrix can approve payment certificates. Approval by an unauthorised party is technically impossible — not just against policy. Every payment approval carries the approver's verified identity and the authority basis.",
  },
  {
    title: 'Variation order instruction',
    body: "Only designated authority levels can formally instruct a variation order. Verbal instructions that bypass the authority matrix produce no binding record — the formal instruction must be issued through BaytyAI to trigger the variation workflow. This eliminates the 'oral instruction' dispute category.",
  },
  {
    title: 'Contractor verification approval',
    body: "Verification decisions — approving or rejecting an organisation's participation — are restricted to designated verification-authority roles. No contractor, consultant, or supplier can self-approve their participation. Every decision is recorded with the approver's identity and basis.",
  },
];

const GDPR = [
  {
    title: 'Lawful basis documented',
    body: "Processing of EU data subjects' account and project-participation data is on the basis of contract performance (Article 6(1)(b)). Marketing communications require explicit consent (Article 6(1)(a)).",
  },
  {
    title: 'Data-subject rights mechanism',
    body: 'EU data subjects can exercise access, rectification, erasure, restriction, portability, and objection rights via enterprise@baytyai.com. Requests are responded to within 30 days per GDPR Article 12.',
  },
  {
    title: 'International transfer safeguards',
    body: 'Transfers from the EU/EEA to the UAE are governed by Standard Contractual Clauses where required. EU data is currently processed in AWS Frankfurt (EEA) — no transfer is currently required for EU users.',
  },
  {
    title: 'EU representative',
    body: 'An EU-based GDPR representative is designated for correspondence from EU supervisory authorities and EU data subjects. Contact details are available in the Privacy Policy.',
  },
];

const SUBPROCESSORS: {
  name: string;
  purpose: string;
  data: string;
  location: string;
  ref: string;
  planned?: boolean;
}[] = [
  {
    name: 'Supabase',
    purpose: 'Database, storage, authentication',
    data: 'All platform data',
    location: 'EU Frankfurt / Global',
    ref: 'supabase.com/privacy',
  },
  {
    name: 'Vercel',
    purpose: 'Hosting, CDN, edge delivery',
    data: 'Request metadata',
    location: 'Global edge / US',
    ref: 'vercel.com/legal/privacy-policy',
  },
  {
    name: 'Resend',
    purpose: 'Transactional email',
    data: 'Email addresses, notification content',
    location: 'US',
    ref: 'resend.com/legal/privacy-policy',
  },
  {
    name: 'Anthropic',
    purpose: 'AI capabilities',
    data: 'Project data queries (org-scoped, not retained for training)',
    location: 'US',
    ref: 'anthropic.com/legal/privacy',
  },
  {
    name: 'Stripe',
    purpose: 'Payment processing',
    data: 'Payment data only',
    location: 'US / Global',
    ref: 'stripe.com/privacy',
    planned: true,
  },
];

function Overline({ children, light }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className={`font-dmmono text-[11px] uppercase tracking-[0.28em] ${light ? 'text-slateink' : 'text-gold'}`}
    >
      {children}
    </p>
  );
}

/* ── page ───────────────────────────────────────────────────────── */

export default function ComplianceContent() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <LuxShell>
      {/* SECTION 1 — HERO */}
      <section className="pt-[76px]">
        <div className="mx-auto w-full max-w-container px-6 py-24 md:px-10 md:pb-section md:pt-36">
          <FadeUp>
            <Overline>BaytyAI → Compliance</Overline>
          </FadeUp>
          <FadeUp delay={0.08} className="mt-8 max-w-[820px]">
            <h1 className="font-cormorant text-[clamp(2rem,7vw,4.5rem)] font-light leading-[1.06] tracking-[-0.01em] text-offwhite">
              When your program spans five countries, six regulators, and three data protection laws
              —<span className="text-gold"> compliance cannot be generic.</span>
            </h1>
          </FadeUp>
          <FadeUp delay={0.16} className="mt-8 max-w-[620px]">
            <p className="font-dmsans text-lg font-light leading-relaxed text-offwhite/65 md:text-xl">
              BaytyAI&apos;s compliance architecture is designed for the regulatory reality of
              global mega-project delivery. Specific regulation citations. Documented obligations.
              Implemented controls — with roadmap items labelled honestly, not dressed up as done.
            </p>
          </FadeUp>
          <FadeUp delay={0.24} className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="mailto:enterprise@baytyai.com?subject=DPA Request"
              className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors hover:bg-gold-soft"
            >
              Request DPA →
            </a>
            <a
              href="/security"
              className="inline-flex items-center justify-center gap-2 border-[0.5px] border-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
            >
              Review security posture →
            </a>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 2 — REGULATION GRID */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline light>Regulatory Coverage</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[48px]">
              Every major data protection law your program operates under.
            </h2>
          </FadeUp>
          <Stagger className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {REGULATIONS.map((r) => (
              <StaggerItem key={r.label}>
                <div
                  className="flex h-full flex-col border-[0.5px] border-gold/30 bg-navy p-7"
                  style={{ borderRadius: 2 }}
                >
                  <Scale className="size-5 text-gold" strokeWidth={1.25} aria-hidden />
                  <p className="mt-5 font-dmmono text-[11px] uppercase tracking-[0.2em] text-gold">
                    {r.label}
                  </p>
                  <h3 className="mt-2 font-cormorant text-lg font-normal leading-snug text-offwhite">
                    {r.regulation}
                  </h3>
                  <ul className="mt-5 flex flex-col gap-3">
                    {r.obligations.map((o) => (
                      <li
                        key={o}
                        className="flex items-start gap-2.5 font-dmsans text-[13px] font-light leading-relaxed text-offwhite/65"
                      >
                        <span className="mt-0.5 text-gold">✓</span> {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 3 — DPA FRAMEWORK */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline>Data Processing Agreement</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[52px]">
              The legal framework for how BaytyAI processes your program&apos;s data.
            </h2>
            <p className="mt-6 max-w-3xl font-dmsans text-base font-light leading-relaxed text-offwhite/65">
              BaytyAI acts in two distinct legal roles depending on the data type. For user account
              data and identity verification data, BaytyAI is the Data Controller. For project
              records, approval histories, and commercial documents created by enterprise clients,
              BaytyAI is the Data Processor — acting on the client&apos;s instructions as
              Controller.
            </p>
          </FadeUp>
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
            {[
              {
                t: 'When BaytyAI is Data Controller',
                items: CONTROLLER,
                note: "BaytyAI's Privacy Policy governs this processing. Data-subject rights are exercisable directly with BaytyAI.",
              },
              {
                t: 'When BaytyAI is Data Processor',
                items: PROCESSOR,
                note: 'A Data Processing Agreement is required. BaytyAI processes under your instructions as Controller. The DPA includes sub-processor disclosure and audit rights.',
              },
            ].map((c) => (
              <FadeUp key={c.t}>
                <div
                  className="flex h-full flex-col border-[0.5px] border-gold/25 bg-navy-card p-8"
                  style={{ borderRadius: 2 }}
                >
                  <h3 className="font-cormorant text-2xl font-normal text-offwhite">{c.t}</h3>
                  <ul className="mt-5 flex flex-1 flex-col gap-3">
                    {c.items.map((it) => (
                      <li
                        key={it}
                        className="flex items-start gap-2.5 font-dmsans text-[14px] font-light leading-relaxed text-offwhite/70"
                      >
                        <span className="mt-0.5 text-gold">•</span> {it}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 border-t border-gold/20 pt-5 font-dmsans text-[13px] font-light italic leading-relaxed text-offwhite/55">
                    {c.note}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
          <FadeUp delay={0.1} className="mt-10">
            <a
              href="mailto:enterprise@baytyai.com?subject=DPA Request"
              className="inline-flex items-center justify-center gap-2 bg-gold px-7 py-3.5 font-dmmono text-[12px] uppercase tracking-[0.18em] text-navy transition-colors hover:bg-gold-soft"
            >
              Request Data Processing Agreement →
            </a>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 4 — AUDIT TRAIL */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline light>Audit Trail</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[44px]">
              Every decision, documented. Every record, permanent.
            </h2>
            <p className="mt-6 max-w-3xl font-dmsans text-base font-light leading-relaxed text-slateink">
              On mega-projects, the compliance requirement is not just that the right process was
              followed — it is that you can prove it. BaytyAI&apos;s audit trail is the compliance
              infrastructure that makes your program&apos;s decision history defensible to
              regulators, auditors, arbitration panels, and government oversight bodies.
            </p>
          </FadeUp>
          <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {AUDIT.map((a) => (
              <StaggerItem key={a.label}>
                <div
                  className="flex gap-5 border-[0.5px] border-navy/15 bg-white p-6 md:p-7"
                  style={{ borderRadius: 2 }}
                >
                  <a.icon className="size-5 shrink-0 text-navy" strokeWidth={1.5} aria-hidden />
                  <div>
                    <h3 className="font-dmmono text-[12px] uppercase tracking-[0.16em] text-navy">
                      {a.label}
                    </h3>
                    <p className="mt-2 font-dmsans text-[14px] font-light leading-relaxed text-slateink">
                      {a.desc}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
          <FadeUp delay={0.1}>
            <p className="mt-10 max-w-3xl border-l-2 border-gold pl-6 font-dmsans text-sm font-light leading-relaxed text-slateink">
              All audit records are retained for a minimum of 7 years. Corporate-tier clients can
              configure extended retention to 15 years for programs with long-term liability tails.
              Audit records are exported in JSON and PDF formats on request.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 5 — AUTHORITY MATRIX */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline>Authority Matrix Governance</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[44px]">
              Who is authorised to decide what — enforced by the platform, not by policy.
            </h2>
            <p className="mt-6 max-w-3xl font-dmsans text-base font-light leading-relaxed text-offwhite/65">
              The most common compliance failure on mega-projects is not that the wrong person made
              a decision — it is that the wrong person could, without the system preventing or
              recording it. BaytyAI enforces approval rights at the workflow level: if a party lacks
              authority for an action, the workflow does not offer it. Authority is explicitly
              configured and enforced, not assumed from role.
            </p>
          </FadeUp>
          <Stagger className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {AUTHORITY.map((c) => (
              <StaggerItem key={c.title}>
                <div
                  className="h-full border-l-2 border-gold bg-navy-card p-8"
                  style={{ borderRadius: 2 }}
                >
                  <h3 className="font-cormorant text-xl font-normal text-offwhite">{c.title}</h3>
                  <p className="mt-4 font-dmsans text-[14px] font-light leading-relaxed text-offwhite/65">
                    {c.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 6 — GDPR SPECIFIC */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline light>GDPR — EU and International Programs</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-4xl font-semibold leading-[1.1] text-navy md:text-[44px]">
              GDPR compliance for programs with EU-resident participants.
            </h2>
            <p className="mt-5 max-w-2xl font-dmsans text-base font-light text-slateink">
              Many mega-programs in the GCC and internationally include EU-resident architects,
              engineers, and consultants. Where BaytyAI processes EU data subjects&apos; personal
              data, GDPR Article 3 territorial scope applies — regardless of BaytyAI&apos;s UAE
              headquarters.
            </p>
          </FadeUp>
          <Stagger className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-2">
            {GDPR.map((g) => (
              <StaggerItem key={g.title}>
                <div
                  className="h-full border-[0.5px] border-navy/15 bg-white p-7"
                  style={{ borderRadius: 2 }}
                >
                  <h3 className="font-dmmono text-[12px] uppercase tracking-[0.16em] text-navy">
                    {g.title}
                  </h3>
                  <p className="mt-3 font-dmsans text-[14px] font-light leading-relaxed text-slateink">
                    {g.body}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* SECTION 7 — SUB-PROCESSORS */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 md:px-10">
          <FadeUp>
            <Overline>Sub-Processors</Overline>
            <h2 className="mt-6 max-w-3xl font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[44px]">
              Every third-party service that processes program data — named.
            </h2>
            <p className="mt-5 max-w-2xl font-dmsans text-base font-light text-offwhite/65">
              GDPR Article 28 and equivalent laws require sub-processor disclosure. The services
              below process BaytyAI customer data. Stripe is listed as planned — it processes data
              only once payment processing is activated for a program.
            </p>
          </FadeUp>
          <FadeUp delay={0.08}>
            <div className="mt-12 overflow-x-auto border-[0.5px] border-gold/20">
              <table className="w-full min-w-[820px] border-collapse text-left">
                <thead>
                  <tr className="bg-navy-card text-offwhite">
                    {['Sub-processor', 'Purpose', 'Data processed', 'Location', 'Status'].map(
                      (h) => (
                        <th
                          key={h}
                          className="p-4 font-dmmono text-[10px] uppercase tracking-[0.14em] text-gold"
                        >
                          {h}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {SUBPROCESSORS.map((s) => (
                    <tr key={s.name} className="border-t border-gold/10">
                      <td className="p-4 font-dmsans text-sm font-medium text-offwhite">
                        {s.name}
                      </td>
                      <td className="p-4 font-dmsans text-[13px] font-light text-offwhite/70">
                        {s.purpose}
                      </td>
                      <td className="p-4 font-dmsans text-[13px] font-light text-offwhite/70">
                        {s.data}
                      </td>
                      <td className="p-4 font-dmsans text-[13px] font-light text-offwhite/70">
                        {s.location}
                      </td>
                      <td className="p-4 font-dmmono text-[10px] uppercase tracking-[0.12em]">
                        {s.planned ? (
                          <span className="text-amber-400/80">Planned</span>
                        ) : (
                          <span className="text-gold">Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FadeUp>
          <FadeUp delay={0.12}>
            <p className="mt-6 max-w-3xl font-dmsans text-sm font-light leading-relaxed text-offwhite/50">
              BaytyAI will notify enterprise clients of any material sub-processor change a minimum
              of 30 days before it takes effect, allowing clients to object or terminate per their
              DPA rights. A full sub-processor list with data types, locations, and legal basis is
              available on request.
            </p>
          </FadeUp>
        </div>
      </section>

      {/* SECTION 8 — FAQ */}
      <section className="bg-offwhite py-24 text-navy md:py-section">
        <div className="mx-auto w-full max-w-3xl px-6 md:px-10">
          <FadeUp>
            <Overline light>Compliance FAQ</Overline>
            <h2 className="mt-6 font-cormorant text-3xl font-semibold leading-[1.1] text-navy md:text-[44px]">
              What legal and procurement teams ask — answered with citations.
            </h2>
          </FadeUp>
          <div className="mt-12 flex flex-col border-y border-navy/15">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q} className="border-b border-navy/15 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-6 text-left"
                  >
                    <span className="font-dmsans text-base font-medium text-navy">{f.q}</span>
                    <ChevronDown
                      className={`size-5 shrink-0 text-gold transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ${isOpen ? 'grid-rows-[1fr] pb-6' : 'grid-rows-[0fr]'}`}
                  >
                    <div className="overflow-hidden">
                      <p className="font-dmsans text-[15px] font-light leading-relaxed text-slateink">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION 9 — CONTACT */}
      <section className="py-24 md:py-section">
        <div className="mx-auto w-full max-w-container px-6 text-center md:px-10">
          <FadeUp>
            <h2 className="mx-auto max-w-3xl font-cormorant text-3xl font-light leading-[1.1] text-offwhite md:text-[48px]">
              Your legal team has requirements. We have documentation.
            </h2>
            <p className="mx-auto mt-6 max-w-2xl font-dmsans text-base font-light text-offwhite/65">
              BaytyAI provides Data Processing Agreements, sub-processor lists, compliance
              questionnaire responses, and jurisdiction-specific compliance assessments to qualified
              enterprise and government programs.
            </p>
          </FadeUp>
          <Stagger className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: 'Data Processing Agreement',
                body: 'English and Arabic DPA template available within 48 hours of request.',
                subject: 'DPA Request',
              },
              {
                icon: Globe,
                title: 'Jurisdiction Assessment',
                body: 'Compliance assessment for specific jurisdictions including KSA, Singapore, UK, and EU.',
                subject: 'Jurisdiction Assessment',
              },
              {
                icon: Shield,
                title: 'Compliance Questionnaire',
                body: 'Standard security and compliance questionnaire responses for procurement evaluation.',
                subject: 'Compliance Questionnaire',
              },
            ].map((c) => (
              <StaggerItem key={c.title}>
                <a
                  href={`mailto:enterprise@baytyai.com?subject=${encodeURIComponent(c.subject)}`}
                  className="flex h-full flex-col border-[0.5px] border-gold/25 bg-navy-card p-8 text-left transition-colors hover:border-gold/50"
                  style={{ borderRadius: 2 }}
                >
                  <c.icon className="size-6 text-gold" strokeWidth={1.25} aria-hidden />
                  <h3 className="mt-6 font-dmsans text-lg font-medium text-offwhite">{c.title}</h3>
                  <p className="mt-3 flex-1 font-dmsans text-[14px] font-light leading-relaxed text-offwhite/60">
                    {c.body}
                  </p>
                  <span className="mt-6 font-dmmono text-[11px] uppercase tracking-[0.14em] text-gold">
                    enterprise@baytyai.com →
                  </span>
                </a>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>
    </LuxShell>
  );
}
