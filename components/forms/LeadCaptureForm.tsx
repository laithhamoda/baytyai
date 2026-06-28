'use client';

import { useState } from 'react';

import {
  INQUIRY_HEADINGS,
  REGIONS,
  ROLES,
  leadSchema,
  type InquiryType,
  type LeadInput,
} from '@/app/actions/lead-schema';
import { submitLead } from '@/app/actions/submitLead';

const GOLD = '#C9A84C';
const NAVY = '#0A1628';
const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";
const serif = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";
const mono = "var(--font-mono, 'DM Mono', monospace)";

const fieldBase: React.CSSProperties = {
  width: '100%',
  height: '48px',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid #C9A84C',
  borderRadius: 0,
  color: NAVY,
  fontFamily: sans,
  fontWeight: 300,
  fontSize: '14px',
  padding: '0 0 0 2px',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: mono,
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(10,22,40,0.5)',
  marginBottom: '6px',
  display: 'block',
};

const EMPTY = {
  fullName: '',
  workEmail: '',
  organization: '',
  role: '',
  region: '',
  message: '',
  website: '',
};

export default function LeadCaptureForm({
  inquiryType,
  onClose,
}: {
  inquiryType: InquiryType;
  onClose: () => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function set(name: keyof typeof EMPTY, value: string) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    const payload: LeadInput = { ...values, inquiryType };
    const parsed = leadSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.');
      return;
    }
    setSubmitting(true);
    const result = await submitLead(parsed.data);
    setSubmitting(false);
    if (result.ok) setDone(true);
    else setError(result.error);
  }

  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 8px' }}>
        <div
          style={{ width: '40px', height: '0.5px', backgroundColor: GOLD, margin: '0 auto 24px' }}
        />
        <p
          style={{
            fontFamily: serif,
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '22px',
            lineHeight: 1.6,
            color: GOLD,
            marginBottom: '28px',
          }}
        >
          Thank you, {values.fullName}. We respond within two business days.
        </p>
        <button
          type="button"
          onClick={onClose}
          style={{
            height: '48px',
            padding: '0 32px',
            backgroundColor: NAVY,
            color: '#F8F6F1',
            border: 'none',
            borderRadius: 0,
            fontFamily: sans,
            fontWeight: 500,
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <h2
        style={{
          fontFamily: serif,
          fontWeight: 600,
          fontSize: '26px',
          color: NAVY,
          marginBottom: '4px',
        }}
      >
        {INQUIRY_HEADINGS[inquiryType]}
      </h2>

      <div>
        <label htmlFor="lc-name" style={labelStyle}>
          Full name
        </label>
        <input
          id="lc-name"
          required
          value={values.fullName}
          onChange={(e) => set('fullName', e.target.value)}
          style={fieldBase}
          placeholder="Khalid Al Rashid"
        />
      </div>
      <div>
        <label htmlFor="lc-email" style={labelStyle}>
          Work email
        </label>
        <input
          id="lc-email"
          type="email"
          required
          value={values.workEmail}
          onChange={(e) => set('workEmail', e.target.value)}
          style={fieldBase}
          placeholder="khalid@company.ae"
        />
      </div>
      <div>
        <label htmlFor="lc-org" style={labelStyle}>
          Organization
        </label>
        <input
          id="lc-org"
          required
          value={values.organization}
          onChange={(e) => set('organization', e.target.value)}
          style={fieldBase}
          placeholder="Al Wasl Development"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <label htmlFor="lc-role" style={labelStyle}>
            Role
          </label>
          <select
            id="lc-role"
            required
            value={values.role}
            onChange={(e) => set('role', e.target.value)}
            style={{
              ...fieldBase,
              color: values.role ? NAVY : 'rgba(10,22,40,0.4)',
              cursor: 'pointer',
            }}
          >
            <option value="" disabled>
              Select
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="lc-region" style={labelStyle}>
            Region
          </label>
          <select
            id="lc-region"
            required
            value={values.region}
            onChange={(e) => set('region', e.target.value)}
            style={{
              ...fieldBase,
              color: values.region ? NAVY : 'rgba(10,22,40,0.4)',
              cursor: 'pointer',
            }}
          >
            <option value="" disabled>
              Select
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lc-msg" style={labelStyle}>
          Message (optional)
        </label>
        <textarea
          id="lc-msg"
          rows={3}
          maxLength={500}
          value={values.message}
          onChange={(e) => set('message', e.target.value)}
          style={{
            ...fieldBase,
            height: 'auto',
            paddingTop: '10px',
            resize: 'vertical',
            lineHeight: 1.6,
          }}
          placeholder="Tell us about your project or portfolio"
        />
      </div>

      {/* Honeypot — visually hidden, must stay empty */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '-9999px',
          width: '1px',
          height: '1px',
          overflow: 'hidden',
        }}
      >
        <label htmlFor="lc-website">Website</label>
        <input
          id="lc-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set('website', e.target.value)}
        />
      </div>

      {error && (
        <p role="alert" style={{ fontFamily: sans, fontSize: '13px', color: '#9B2C2C' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        style={{
          width: '100%',
          height: '56px',
          backgroundColor: GOLD,
          color: NAVY,
          border: 'none',
          borderRadius: 0,
          fontFamily: sans,
          fontWeight: 500,
          fontSize: '13px',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          cursor: submitting ? 'wait' : 'pointer',
          opacity: submitting ? 0.7 : 1,
          marginTop: '4px',
        }}
      >
        {submitting ? 'Sending…' : 'Submit request →'}
      </button>
    </form>
  );
}
