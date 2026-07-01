'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Star, AlertTriangle, Check, Clock, FileText } from 'lucide-react';

/* ─────────── shared helpers ─────────── */

const GOLD = '#C9A84C';
const NAVY = '#0A1628';
const CARD = '#0F1E35';
const BORDER = 'rgba(201,168,76,0.25)';

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: 'easeOut' },
  };
}

const mono: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  letterSpacing: '0.15em',
  textTransform: 'uppercase',
};
const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";
const serif = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";

interface ScreenProps {
  index: number;
  annotation: string;
  caption: string;
  reverse?: boolean;
  children: React.ReactNode;
}

function Screen({ index, annotation, caption, reverse, children }: ScreenProps) {
  return (
    <section
      style={{
        padding: '100px 24px',
        borderTop: '0.5px solid rgba(201,168,76,0.15)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '56px',
          alignItems: 'center',
        }}
      >
        {/* Mockup */}
        <motion.div {...fadeUp(0.05)} style={{ order: reverse ? 2 : 1 }}>
          {children}
        </motion.div>

        {/* Text */}
        <motion.div {...fadeUp(0.12)} style={{ order: reverse ? 1 : 2 }}>
          <span
            style={{ ...mono, fontSize: '44px', color: 'rgba(201,168,76,0.3)', fontWeight: 300 }}
          >
            0{index}
          </span>
          <div
            style={{
              marginTop: '20px',
              borderLeft: `2px solid ${GOLD}`,
              paddingLeft: '20px',
            }}
          >
            <p style={{ ...mono, fontSize: '11px', color: GOLD, marginBottom: '10px' }}>
              {annotation}
            </p>
            <p
              style={{
                fontFamily: sans,
                fontWeight: 300,
                fontSize: '17px',
                lineHeight: 1.7,
                color: 'rgba(248,246,241,0.7)',
              }}
            >
              {caption}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ border: `0.5px solid ${BORDER}`, backgroundColor: CARD, padding: '20px' }}>
      {children}
    </div>
  );
}

function Badge({ label, tone = 'gold' }: { label: string; tone?: 'gold' | 'muted' | 'red' }) {
  const color = tone === 'gold' ? GOLD : tone === 'red' ? '#C87878' : 'rgba(248,246,241,0.4)';
  return (
    <span
      style={{
        ...mono,
        fontSize: '9px',
        color,
        border: `0.5px solid ${color}`,
        padding: '3px 8px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

/* ─────────── 1. Dashboard ─────────── */

const PROJECTS = [
  { name: 'Marina Tower A', stage: 6, team: 12, approvals: 3, risk: false },
  { name: 'Downtown Villa 7', stage: 4, team: 8, approvals: 1, risk: false },
  { name: 'Pearl Residences', stage: 8, team: 21, approvals: 0, risk: false },
  { name: 'Al Reem Plaza', stage: 3, team: 6, approvals: 5, risk: true },
  { name: 'Saadiyat Hotel', stage: 5, team: 15, approvals: 2, risk: false },
  { name: 'Creek Offices', stage: 7, team: 18, approvals: 1, risk: false },
];

function DashboardMockup() {
  return (
    <Frame>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {PROJECTS.map((p) => (
          <div
            key={p.name}
            style={{
              border: `0.5px solid ${p.risk ? GOLD : 'rgba(201,168,76,0.15)'}`,
              padding: '14px',
              backgroundColor: NAVY,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <span
                style={{ fontFamily: sans, fontWeight: 500, fontSize: '12px', color: '#F8F6F1' }}
              >
                {p.name}
              </span>
              {p.risk && <AlertTriangle size={13} color={GOLD} strokeWidth={2} />}
            </div>
            {/* progress 1-9 */}
            <div style={{ display: 'flex', gap: '2px', marginBottom: '10px' }}>
              {Array.from({ length: 9 }).map((_, s) => (
                <span
                  key={s}
                  style={{
                    flex: 1,
                    height: '3px',
                    backgroundColor: s < p.stage ? GOLD : 'rgba(248,246,241,0.12)',
                  }}
                />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ ...mono, fontSize: '8px', color: 'rgba(248,246,241,0.45)' }}>
                {p.team} TEAM
              </span>
              <span
                style={{
                  ...mono,
                  fontSize: '8px',
                  color: p.approvals ? GOLD : 'rgba(248,246,241,0.45)',
                }}
              >
                {p.approvals} PENDING
              </span>
            </div>
            {p.risk && (
              <div
                style={{
                  marginTop: '10px',
                  borderTop: '0.5px solid rgba(201,168,76,0.2)',
                  paddingTop: '8px',
                }}
              >
                <span style={{ ...mono, fontSize: '8px', color: GOLD, letterSpacing: '0.05em' }}>
                  Approval pending 52h — SLA breach in 20 hours
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ─────────── 2. Verification ─────────── */

const DOCS = [
  { name: 'Emirates ID', status: 'Verified' },
  { name: 'Trade Licence', status: 'Verified' },
  { name: 'Professional Certificate', status: 'Verified' },
];

function VerificationMockup() {
  return (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {DOCS.map((d) => (
          <div
            key={d.name}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              border: '0.5px solid rgba(201,168,76,0.15)',
              padding: '12px 14px',
              backgroundColor: NAVY,
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Check size={14} color={GOLD} strokeWidth={2.5} />
              <span
                style={{ fontFamily: sans, fontWeight: 300, fontSize: '13px', color: '#F8F6F1' }}
              >
                {d.name}
              </span>
            </span>
            <Badge label={d.status} />
          </div>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          border: `0.5px solid ${GOLD}`,
          padding: '16px',
          backgroundColor: 'rgba(201,168,76,0.06)',
        }}
      >
        <ShieldCheck size={28} color={GOLD} strokeWidth={1.5} />
        <div>
          <p style={{ fontFamily: sans, fontWeight: 500, fontSize: '13px', color: GOLD }}>
            Bayty Verified
          </p>
          <p style={{ ...mono, fontSize: '9px', color: 'rgba(248,246,241,0.5)', marginTop: '3px' }}>
            Issued 02 Jun 2026
          </p>
        </div>
      </div>
    </Frame>
  );
}

/* ─────────── 3. Approval workflow ─────────── */

const APPROVALS = [
  { name: 'K. Al Rashid', role: 'Project Owner', time: 'Approved · 2 Jun 09:14', done: true },
  { name: 'S. Haddad', role: 'Lead Consultant', time: 'Approved · 2 Jun 11:02', done: true },
  { name: 'M. Farouk', role: 'MEP Engineer', time: 'Pending 18h', done: false, pending: true },
  { name: 'L. Nasser', role: 'QA Inspector', time: 'Awaiting', done: false },
  { name: 'R. Aziz', role: 'General Manager', time: 'Awaiting', done: false },
];

function ApprovalMockup() {
  return (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {APPROVALS.map((a, i) => (
          <div key={a.name} style={{ display: 'flex', gap: '14px' }}>
            {/* rail */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '999px',
                  border: `0.5px solid ${a.done ? GOLD : a.pending ? GOLD : 'rgba(248,246,241,0.2)'}`,
                  backgroundColor: a.done ? GOLD : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {a.done ? (
                  <Check size={12} color={NAVY} strokeWidth={3} />
                ) : a.pending ? (
                  <Clock size={12} color={GOLD} strokeWidth={2} />
                ) : (
                  <span style={{ ...mono, fontSize: '9px', color: 'rgba(248,246,241,0.4)' }}>
                    {i + 1}
                  </span>
                )}
              </span>
              {i < APPROVALS.length - 1 && (
                <span
                  style={{
                    width: '0.5px',
                    flex: 1,
                    minHeight: '22px',
                    backgroundColor: 'rgba(201,168,76,0.25)',
                  }}
                />
              )}
            </div>
            {/* content */}
            <div style={{ paddingBottom: '18px', flex: 1 }}>
              <div
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span
                  style={{ fontFamily: sans, fontWeight: 500, fontSize: '13px', color: '#F8F6F1' }}
                >
                  {a.name}
                </span>
                {a.pending && (
                  <button
                    style={{
                      ...mono,
                      fontSize: '9px',
                      color: NAVY,
                      backgroundColor: GOLD,
                      border: 'none',
                      padding: '4px 10px',
                      cursor: 'pointer',
                    }}
                  >
                    Send reminder
                  </button>
                )}
              </div>
              <p
                style={{
                  fontFamily: sans,
                  fontWeight: 300,
                  fontSize: '11px',
                  color: 'rgba(248,246,241,0.5)',
                }}
              >
                {a.role}
              </p>
              <p
                style={{
                  ...mono,
                  fontSize: '9px',
                  color: a.pending ? GOLD : 'rgba(248,246,241,0.4)',
                  marginTop: '3px',
                }}
              >
                {a.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ─────────── 4. Document hub ─────────── */

const FILES = [
  {
    v: 'v4',
    name: 'Tower A — MEP Drawings',
    by: 'M. Farouk',
    date: '2 Jun 2026',
    status: 'Approved',
    current: true,
  },
  {
    v: 'v3',
    name: 'Tower A — MEP Drawings',
    by: 'M. Farouk',
    date: '28 May 2026',
    status: 'Superseded',
    current: false,
  },
  {
    v: 'v2',
    name: 'Tower A — MEP Drawings',
    by: 'S. Haddad',
    date: '21 May 2026',
    status: 'Superseded',
    current: false,
  },
];

function DocumentMockup() {
  return (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {FILES.map((f) => (
          <div
            key={f.v}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              border: '0.5px solid rgba(201,168,76,0.15)',
              padding: '12px 14px',
              backgroundColor: NAVY,
              opacity: f.current ? 1 : 0.45,
            }}
          >
            <FileText size={16} color={GOLD} strokeWidth={1.5} />
            <span
              style={{
                ...mono,
                fontSize: '10px',
                color: f.current ? GOLD : 'rgba(248,246,241,0.5)',
              }}
            >
              {f.v}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: sans, fontWeight: 400, fontSize: '12px', color: '#F8F6F1' }}>
                {f.name}
              </p>
              <p
                style={{
                  ...mono,
                  fontSize: '8px',
                  color: 'rgba(248,246,241,0.45)',
                  marginTop: '2px',
                }}
              >
                {f.by} · {f.date}
              </p>
            </div>
            <Badge label={f.status} tone={f.current ? 'gold' : 'muted'} />
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'right', marginTop: '12px' }}>
        <span
          style={{
            ...mono,
            fontSize: '9px',
            color: GOLD,
            borderBottom: `0.5px solid ${GOLD}`,
            paddingBottom: '1px',
            cursor: 'pointer',
          }}
        >
          View history
        </span>
      </div>
    </Frame>
  );
}

/* ─────────── 5. Marketplace ─────────── */

const PROS = [
  { initial: 'A', role: 'MEP Engineer', loc: 'London, UK', projects: 34, rating: '4.9' },
  {
    initial: 'S',
    role: 'Structural Consultant',
    loc: 'Singapore',
    projects: 27,
    rating: '4.8',
  },
  { initial: 'H', role: 'QA / Inspection Lead', loc: 'New York, US', projects: 19, rating: '5.0' },
];

function MarketplaceMockup() {
  return (
    <Frame>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {PROS.map((p) => (
          <div
            key={p.initial}
            style={{
              border: '0.5px solid rgba(201,168,76,0.15)',
              padding: '14px',
              backgroundColor: NAVY,
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                width: '40px',
                height: '40px',
                border: `0.5px solid ${GOLD}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: serif,
                fontSize: '18px',
                color: GOLD,
                flexShrink: 0,
              }}
            >
              {p.initial}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{ fontFamily: sans, fontWeight: 500, fontSize: '12px', color: '#F8F6F1' }}
                >
                  {p.role}
                </span>
                <ShieldCheck size={12} color={GOLD} strokeWidth={2} />
              </div>
              <p
                style={{
                  ...mono,
                  fontSize: '8px',
                  color: 'rgba(248,246,241,0.45)',
                  marginTop: '3px',
                }}
              >
                {p.loc} · {p.projects} PROJECTS
              </p>
              <span style={{ display: 'flex', alignItems: 'center', gap: '3px', marginTop: '4px' }}>
                <Star size={10} color={GOLD} fill={GOLD} />
                <span style={{ ...mono, fontSize: '8px', color: GOLD }}>{p.rating}</span>
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flexShrink: 0 }}>
              <button
                style={{
                  ...mono,
                  fontSize: '8px',
                  color: NAVY,
                  backgroundColor: GOLD,
                  border: 'none',
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Shortlist
              </button>
              <button
                style={{
                  ...mono,
                  fontSize: '8px',
                  color: GOLD,
                  backgroundColor: 'transparent',
                  border: `0.5px solid ${GOLD}`,
                  padding: '5px 10px',
                  cursor: 'pointer',
                }}
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ─────────── page ─────────── */

export default function ProductClient() {
  return (
    <div style={{ backgroundColor: NAVY }}>
      {/* Hero */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '160px 24px 80px' }}>
        <motion.p
          {...fadeUp(0)}
          style={{ ...mono, fontSize: '11px', color: GOLD, marginBottom: '24px' }}
        >
          The Platform
        </motion.p>
        <motion.h1
          {...fadeUp(0.08)}
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: 'clamp(40px, 6vw, 64px)',
            lineHeight: 1.08,
            color: '#F8F6F1',
            maxWidth: '780px',
            marginBottom: '24px',
          }}
        >
          A guided walkthrough of every workspace
        </motion.h1>
        <motion.p
          {...fadeUp(0.16)}
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: '18px',
            lineHeight: 1.75,
            color: 'rgba(248,246,241,0.6)',
            maxWidth: '560px',
          }}
        >
          From verified onboarding to structured approvals and a trusted marketplace, see exactly
          how BaytyAI runs a global construction project end to end.
        </motion.p>
      </section>

      <Screen
        index={1}
        annotation="Project Dashboard"
        caption="Every active development at a glance, with a 9-stage progress tracker, team size, and pending approvals. Risk flags surface SLA breaches before they delay the project."
      >
        <DashboardMockup />
      </Screen>

      <Screen
        index={2}
        reverse
        annotation="Verification Profile"
        caption="Stakeholders submit identity, company registration, licence, insurance, and professional certificates for credential review. Once cleared, the Bayty Verified badge unlocks platform access."
      >
        <VerificationMockup />
      </Screen>

      <Screen
        index={3}
        annotation="Approval Workflow"
        caption="A sequential, named sign-off chain replaces scattered email threads. Every step is timestamped, and stalled approvals can be escalated with a single reminder."
      >
        <ApprovalMockup />
      </Screen>

      <Screen
        index={4}
        reverse
        annotation="Document Hub"
        caption="One current version of every drawing and contract, with full version history and approval status. No more chasing the latest file across laptops and inboxes."
      >
        <DocumentMockup />
      </Screen>

      <Screen
        index={5}
        annotation="Professional Marketplace"
        caption="Source verified professionals ranked by credentials, location, and rating. Shortlist and contact directly — every profile is checked before it appears."
      >
        <MarketplaceMockup />
      </Screen>
    </div>
  );
}
