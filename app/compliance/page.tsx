import {
  Scale,
  Globe2,
  FileCheck2,
  Building2,
  UserCheck,
  ShieldCheck,
  Layers,
  Landmark,
  ClipboardCheck,
} from 'lucide-react';

import { LuxShell } from '@/components/lux/chrome';
import {
  PolicyHero,
  ControlBand,
  FaqBand,
  FaqJsonLd,
  PolicyCTA,
  type Control,
  type Faq,
} from '@/components/lux/policy';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Compliance | BaytyAI Regulatory Alignment, Data Residency & Certifications',
  description:
    'BaytyAI compliance posture: GDPR and KSA PDPL alignment, a Data Processing Agreement, defined sub-processors, data-subject rights, data residency options, and a SOC 2 Type II and ISO 27001 certification roadmap — for enterprise legal and government vendor due diligence.',
  alternates: { canonical: 'https://www.baytyai.com/compliance' },
};

const REGULATORY: Control[] = [
  {
    icon: Scale,
    title: 'GDPR alignment (EU/EEA)',
    points: [
      'Lawful-basis, purpose-limitation, and data-minimisation principles applied to every processing activity.',
      'Data Processing Agreement available, with defined controller/processor roles.',
      'Data-subject rights — access, rectification, erasure, portability — supported operationally.',
    ],
  },
  {
    icon: Landmark,
    title: 'KSA PDPL alignment (Saudi Arabia)',
    points: [
      'Processing designed to align with the Personal Data Protection Law for Kingdom-based programs.',
      'Data residency options to keep regulated data within required jurisdictions.',
      'Cross-border transfer handled under documented safeguards.',
    ],
  },
  {
    icon: Globe2,
    title: 'UAE & regional data protection',
    points: [
      'Aligned with UAE PDPL principles for programs in the Emirates and wider GCC.',
      'Bilingual (English / Arabic) records to preserve legal fidelity of consent and notices.',
      'Jurisdiction-aware retention configured per program.',
    ],
  },
];

const CERTIFICATIONS: Control[] = [
  {
    icon: ShieldCheck,
    title: 'SOC 2 Type II',
    points: [
      'Status: in progress — controls designed to the Trust Services Criteria.',
      'Underlying infrastructure (Vercel, Supabase) is already SOC 2 Type II audited.',
      'Bridge letter and provider attestations available under NDA on request.',
    ],
  },
  {
    icon: FileCheck2,
    title: 'ISO/IEC 27001',
    points: [
      'Status: on roadmap — information-security management system being formalised.',
      'Control framework mapped to Annex A domains today, ahead of certification.',
      'Gap assessment and control register shareable with your assessors.',
    ],
  },
  {
    icon: Layers,
    title: 'ISO 19650 (BIM information management)',
    points: [
      'Document control and revision governance modelled on ISO 19650 principles.',
      'Common-data-environment discipline for versioned, status-coded project information.',
      'Auditable handover records aligned to information-management standards.',
    ],
  },
];

const DATA_HANDLING: Control[] = [
  {
    icon: Building2,
    title: 'Sub-processors',
    points: [
      'Vercel (application hosting) and Supabase (managed PostgreSQL, auth, storage).',
      'Resend for transactional email; each engaged under its own data-processing terms.',
      'A current sub-processor list is maintained and provided with the DPA.',
    ],
  },
  {
    icon: ClipboardCheck,
    title: 'Data Processing Agreement',
    points: [
      'DPA available covering scope, purpose, security measures, and sub-processor flow-down.',
      'Standard contractual clauses applied to any cross-border transfer.',
      'Breach-notification commitments defined and time-bound.',
    ],
  },
  {
    icon: UserCheck,
    title: 'Data-subject & client rights',
    points: [
      'Access, correction, export, and deletion requests handled through a defined process.',
      'Retention configured per program; data returned or destroyed on offboarding.',
      'Personal data of multi-jurisdictional delivery teams processed on documented lawful bases.',
    ],
  },
];

const FAQS: Faq[] = [
  {
    q: 'Are you SOC 2 or ISO 27001 certified?',
    a: 'We are transparent about status: BaytyAI’s controls are designed to the SOC 2 Trust Services Criteria and ISO/IEC 27001 Annex A domains, and formal certification is in progress and on our roadmap respectively. Our underlying infrastructure providers (Vercel and Supabase) are already SOC 2 Type II audited, and we can share their attestations and our own control register under NDA.',
  },
  {
    q: 'Can we sign a Data Processing Agreement?',
    a: 'Yes. A DPA is available covering processing scope and purpose, security measures, sub-processor flow-down, standard contractual clauses for cross-border transfers, and time-bound breach notification.',
  },
  {
    q: 'Who are your sub-processors?',
    a: 'Vercel (application hosting), Supabase (managed PostgreSQL, authentication, and storage), and Resend (transactional email). Each is engaged under its own data-processing terms, and a current sub-processor list is provided with the DPA.',
  },
  {
    q: 'Can our regulated data stay in a specific jurisdiction?',
    a: 'Yes. We offer data residency options so regulated personal data can remain within the jurisdiction your program requires, including for KSA PDPL and UAE/GCC programs, with cross-border transfers handled under documented safeguards.',
  },
  {
    q: 'How do you handle government and sovereign entity participation data?',
    a: 'Sovereign and government participation data is processed under least-privilege access, jurisdiction-aware residency and retention, and a full audit trail — with contractual terms tailored to public-sector procurement requirements.',
  },
  {
    q: 'How do you support data-subject rights for our delivery teams?',
    a: 'Access, rectification, erasure, and portability requests are handled through a defined operational process, with personal data of multi-jurisdictional teams processed on documented lawful bases and retained only as long as the program requires.',
  },
  {
    q: 'How do we start compliance due diligence?',
    a: 'Email legal@baytyai.com. We will provide the DPA, sub-processor list, security questionnaire response pack, and provider attestations to support your legal and procurement review.',
  },
];

export default function CompliancePage() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <LuxShell>
        <PolicyHero
          breadcrumb="BaytyAI → Compliance"
          headline={{
            plain: 'Regulatory alignment your legal team can',
            gold: 'verify, not just take on trust.',
          }}
          sub="BaytyAI processes personal data across jurisdictions, government participation records, and legally significant commercial evidence. This page states our regulatory alignment, our certification status honestly, and the documents your legal and compliance teams need to complete due diligence."
          updated="July 2026"
        />

        <ControlBand
          overline="Regulatory Alignment"
          heading="Built to the laws of the jurisdictions you deliver in."
          intro="Mega-projects are multi-jurisdictional. Our processing is designed to align with the regimes that govern your program and your people."
          controls={REGULATORY}
          light
        />

        <ControlBand
          overline="Certifications & Standards"
          heading="Where we are certified, and where we are on the path."
          intro="We do not claim certifications we do not hold. Here is the honest status — with the evidence your assessors can review under NDA."
          controls={CERTIFICATIONS}
        />

        <ControlBand
          overline="Data Processing"
          heading="Defined sub-processors, a signable DPA, and enforceable rights."
          controls={DATA_HANDLING}
          light
        />

        <FaqBand
          overline="Compliance FAQ"
          heading="What legal and procurement teams ask — answered plainly."
          faqs={FAQS}
        />

        <PolicyCTA
          heading="Complete your due diligence with our documents in hand."
          sub="We provide the Data Processing Agreement, sub-processor list, security questionnaire response pack, and provider attestations under NDA. Begin the legal and procurement review."
          primary={{ href: '/access?role=client', label: 'Request enterprise access' }}
          secondaryEmail="legal@baytyai.com"
        />
      </LuxShell>
    </>
  );
}
