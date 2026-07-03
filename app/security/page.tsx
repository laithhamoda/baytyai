import {
  KeyRound,
  Lock,
  ShieldCheck,
  Database,
  ServerCog,
  ScrollText,
  UserCheck,
  Network,
  FileClock,
} from 'lucide-react';

import { LuxShell } from '@/components/lux/chrome';
import {
  PolicyHero,
  ControlBand,
  FaqBand,
  FaqJsonLd,
  PolicyCTA,
  StatBand,
  type Control,
  type Faq,
} from '@/components/lux/policy';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Security | BaytyAI Enterprise Data Protection for Mega-Project Programs',
  description:
    'BaytyAI security architecture: AES-256 at rest, TLS 1.3 in transit, PostgreSQL row-level security, keys in Supabase Vault, least-privilege access, immutable audit logging, and daily point-in-time recovery — built for $1B+ programs and government participation.',
  alternates: { canonical: 'https://www.baytyai.com/security' },
};

const DATA_PROTECTION: Control[] = [
  {
    icon: Lock,
    title: 'Encryption everywhere',
    points: [
      'AES-256 encryption at rest on all database volumes and object storage.',
      'TLS 1.3 for all data in transit; HTTP Strict Transport Security enforced.',
      'No plaintext persistence of identity documents, credentials, or evidence files.',
    ],
  },
  {
    icon: KeyRound,
    title: 'Key management',
    points: [
      'Encryption keys held in Supabase Vault — never co-located with the encrypted data.',
      'Application secrets and service-role keys read only from the server environment; never shipped to the browser.',
      'Signed, expiring URLs for every document download — no public object access.',
    ],
  },
  {
    icon: Database,
    title: 'Tenant isolation',
    points: [
      'PostgreSQL row-level security (RLS) enforced on every table — access is denied by default.',
      'Every query is scoped to the authenticated organisation and role at the database layer, not just the application.',
      'Cross-program data access is structurally impossible, not merely policy-restricted.',
    ],
  },
];

const ACCESS_CONTROL: Control[] = [
  {
    icon: UserCheck,
    title: 'Authentication',
    points: [
      'Email one-time-passcode authentication with short-lived, single-use codes.',
      'Session tokens are HTTP-only, secure-flagged, and expire on inactivity.',
      'Administrative impersonation tooling is absent from production builds by configuration.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Authorisation',
    points: [
      'Role-based access control mapped to the program authority matrix.',
      'Least-privilege by default: participants see only the packages and workflows they are assigned.',
      'Verified-organisation gate — no unverified party can reach sensitive workflows.',
    ],
  },
  {
    icon: Network,
    title: 'Application hardening',
    points: [
      'Server-side input validation on every mutation; parameterised queries only — no string-built SQL.',
      'Per-endpoint rate limiting on all write paths to blunt abuse and enumeration.',
      'Bot mitigation on public forms (honeypot, time-on-form, human confirmation) before any record is created.',
    ],
  },
];

const INFRA: Control[] = [
  {
    icon: ServerCog,
    title: 'Managed infrastructure',
    points: [
      'Application hosted on Vercel; data on Supabase-managed PostgreSQL — both SOC 2 Type II audited providers.',
      'No self-managed servers to patch; platform CVEs remediated by the provider on a managed schedule.',
      'Environment separation between preview and production; secrets scoped per environment.',
    ],
  },
  {
    icon: FileClock,
    title: 'Backups & recovery',
    points: [
      'Automated daily backups with point-in-time recovery on the production database.',
      'Recovery objectives defined and tested; restores are rehearsed, not assumed.',
      'Data durability underwritten by the managed database provider’s replicated storage.',
    ],
  },
  {
    icon: ScrollText,
    title: 'Audit & monitoring',
    points: [
      'Immutable, timestamped audit trail for every approval, decision, and document action.',
      'Attribution on every record — who did what, when, and on which version.',
      'Platform and database logs retained for investigation and forensic reconstruction.',
    ],
  },
];

const FAQS: Faq[] = [
  {
    q: 'How is our data encrypted?',
    a: 'All data is encrypted with AES-256 at rest across database volumes and object storage, and with TLS 1.3 in transit. Encryption keys are managed in Supabase Vault and are never co-located with the data they protect.',
  },
  {
    q: 'How do you keep one program’s data separate from another’s?',
    a: 'Isolation is enforced at the database layer through PostgreSQL row-level security. Every table denies access by default, and every query is automatically scoped to the authenticated organisation and role — so cross-program access is structurally prevented, not just discouraged by application code.',
  },
  {
    q: 'Where is our data hosted, and who can access it?',
    a: 'BaytyAI runs on Vercel (application) and Supabase-managed PostgreSQL (data), both SOC 2 Type II audited providers. Access is governed by role-based permissions mapped to the program authority matrix under a least-privilege model. Service-role credentials are read only server-side and are never exposed to the browser.',
  },
  {
    q: 'What happens to identity documents and credentials you verify?',
    a: 'Verified identity documents, trade licences, and professional certificates are stored encrypted, accessed only through signed, expiring URLs, and never made publicly reachable. Access is limited to the roles that require it for verification.',
  },
  {
    q: 'Do you keep an audit trail we can rely on in a dispute?',
    a: 'Yes. Every approval, decision, and document action is written to an immutable, timestamped audit trail with full attribution — who acted, when, and on which document version — designed to be exported as evidence.',
  },
  {
    q: 'How do you recover from data loss?',
    a: 'The production database has automated daily backups and point-in-time recovery, backed by the managed provider’s replicated storage. Recovery procedures are tested rather than assumed.',
  },
  {
    q: 'How do we report a vulnerability?',
    a: 'Email security@baytyai.com with details. We operate a responsible-disclosure process, acknowledge reports promptly, and coordinate remediation before public discussion.',
  },
];

export default function SecurityPage() {
  return (
    <>
      <FaqJsonLd faqs={FAQS} />
      <LuxShell>
        <PolicyHero
          breadcrumb="BaytyAI → Security"
          headline={{
            plain: 'Security is the condition of entry,',
            gold: 'not a feature we advertise.',
          }}
          sub="BaytyAI holds verified identity documents, hundred-million-dollar commercial decisions, legally significant approval records, and government participation data. The controls below are the terms under which enterprise and sovereign clients allow us onto their programs — stated specifically, because specificity is what procurement evaluates."
          updated="July 2026"
        />

        <StatBand
          items={[
            {
              figure: 'AES-256',
              label: 'Encryption at rest across all data volumes and object storage.',
            },
            { figure: 'TLS 1.3', label: 'Enforced for every byte of data in transit, with HSTS.' },
            { figure: 'RLS', label: 'Row-level security on every table — deny by default.' },
          ]}
        />

        <ControlBand
          overline="Data Protection"
          heading="Your data is encrypted, isolated, and key-separated."
          intro="Encryption is table stakes. What matters to an evaluator is where the keys live and how tenants are separated. Here is exactly how."
          controls={DATA_PROTECTION}
          light
        />

        <ControlBand
          overline="Identity & Access"
          heading="Only verified parties, only the access their role requires."
          controls={ACCESS_CONTROL}
        />

        <ControlBand
          overline="Infrastructure & Resilience"
          heading="Managed, monitored, recoverable, and audit-ready."
          controls={INFRA}
          light
        />

        <FaqBand
          overline="Security FAQ"
          heading="What IT procurement asks — answered specifically."
          faqs={FAQS}
        />

        <PolicyCTA
          heading="Run our controls through your evaluation."
          sub="We support vendor security assessments, provide a security questionnaire response pack, and can execute a data processing agreement. Start the conversation with your IT and procurement teams."
          primary={{ href: '/access?role=client', label: 'Request enterprise access' }}
          secondaryEmail="security@baytyai.com"
        />
      </LuxShell>
    </>
  );
}
