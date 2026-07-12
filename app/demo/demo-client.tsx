'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

import { trackEvent } from '@/lib/analytics';

const TRUST_POINTS = [
  'Account activated within 24 hours of verification',
  'Dedicated onboarding session for Enterprise accounts',
  'Full platform access from day one — no feature gating',
];

const COUNTRIES = [
  'United States',
  'United Kingdom',
  'European Union',
  'UAE',
  'Saudi Arabia',
  'Qatar',
  'India',
  'Singapore',
  'Australia',
  'Other',
];

const COMPANY_SIZES = [
  'I am a freelance professional',
  '1–10 employees',
  '11–50 employees',
  '51–200 employees',
  '201–1,000 employees',
  '1,000+ employees',
];

const PRIMARY_INTERESTS = [
  'Project Management',
  'Marketplace',
  'Both',
  'Join as a verified professional',
];

type Persona = 'manage' | 'professional';

interface FormValues {
  fullName: string;
  companyName: string;
  jobTitle: string;
  workEmail: string;
  mobileNumber: string;
  country: string;
  companySize: string;
  primaryInterest: string;
}

const EMPTY: FormValues = {
  fullName: '',
  companyName: '',
  jobTitle: '',
  workEmail: '',
  mobileNumber: '',
  country: '',
  companySize: '',
  primaryInterest: '',
};

/* ── shared field styles ── */
const fieldBase: React.CSSProperties = {
  width: '100%',
  height: '52px',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid #C9A84C',
  borderRadius: 0,
  color: '#0A1628',
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: '14px',
  padding: '0 0 0 2px',
  outline: 'none',
  appearance: 'none',
  WebkitAppearance: 'none',
};

export default function DemoClient() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [persona, setPersona] = useState<Persona>('manage');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function selectPersona(p: Persona) {
    setPersona(p);
    if (p === 'professional') {
      setValues((prev) => ({
        ...prev,
        companySize: 'I am a freelance professional',
        primaryInterest: 'Join as a verified professional',
      }));
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, persona, formType: 'request-access' }),
      });
      if (!res.ok) throw new Error('Request failed');
      trackEvent('request_access_submit', { persona, interest: values.primaryInterest });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again, or email info@baytyai.com.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#0A1628',
        minHeight: '100vh',
        padding: '120px 48px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: '2fr 3fr',
          gap: '80px',
          alignItems: 'start',
        }}
      >
        {/* ── LEFT COLUMN ── */}
        <div style={{ paddingTop: '48px' }}>
          {/* Overline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: '#C9A84C',
              textTransform: 'uppercase',
              marginBottom: '24px',
            }}
          >
            Private Access
          </motion.p>

          {/* Interactive demo launch */}
          <motion.a
            href="/demo/platform"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.04, ease: 'easeOut' }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '28px',
              padding: '10px 18px',
              border: '1px solid rgba(201,168,76,0.5)',
              borderRadius: '2px',
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#C9A84C',
              textDecoration: 'none',
            }}
          >
            ▶ Explore the interactive demo →
          </motion.a>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.07, ease: 'easeOut' }}
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 300,
              fontSize: '48px',
              lineHeight: 1.08,
              color: '#F8F6F1',
              marginBottom: '24px',
            }}
          >
            Reserve your place on the platform
          </motion.h1>

          {/* Sub */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.14, ease: 'easeOut' }}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 300,
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(248,246,241,0.55)',
              marginBottom: '40px',
            }}
          >
            BaytyAI is currently onboarding select construction professionals, developers,
            contractors, consultants, and suppliers worldwide. Every account is individually
            reviewed before activation.
          </motion.p>

          {/* Trust points */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '0 0 64px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {TRUST_POINTS.map((point) => (
              <li key={point} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                <span
                  style={{
                    display: 'block',
                    width: '20px',
                    height: '0.5px',
                    backgroundColor: '#C9A84C',
                    flexShrink: 0,
                    marginTop: '9px',
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: '14px',
                    lineHeight: 1.65,
                    color: 'rgba(248,246,241,0.65)',
                  }}
                >
                  {point}
                </span>
              </li>
            ))}
          </motion.ul>

          {/* Reference companies */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: '10px',
              letterSpacing: '0.14em',
              color: 'rgba(201,168,76,0.45)',
              textTransform: 'uppercase',
              lineHeight: 1.9,
            }}
          >
            Global developers - public authorities - infrastructure delivery teams
          </motion.p>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          style={{
            backgroundColor: '#F8F6F1',
            padding: '48px',
            borderRadius: 0,
          }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              /* ── Confirmation ── */
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  minHeight: '520px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '24px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '0.5px',
                    backgroundColor: '#C9A84C',
                    margin: '0 auto',
                  }}
                />
                <p
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontStyle: 'italic',
                    fontWeight: 300,
                    fontSize: '22px',
                    lineHeight: 1.6,
                    color: '#C9A84C',
                    maxWidth: '380px',
                  }}
                >
                  Your request has been received. Our team will contact you within 24 hours.
                </p>
                <span
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '0.5px',
                    backgroundColor: '#C9A84C',
                    margin: '0 auto',
                  }}
                />
                {persona === 'manage' && (
                  <Link
                    href="/demo"
                    style={{
                      marginTop: '8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      height: '48px',
                      padding: '0 28px',
                      backgroundColor: '#0A1628',
                      color: '#C9A84C',
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 400,
                      fontSize: '12px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      border: '0.5px solid #C9A84C',
                      borderRadius: 0,
                    }}
                  >
                    Book an onboarding call →
                  </Link>
                )}
              </motion.div>
            ) : (
              /* ── Form ── */
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0' }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontWeight: 600,
                    fontSize: '28px',
                    color: '#0A1628',
                    marginBottom: '36px',
                    letterSpacing: '0.01em',
                  }}
                >
                  Your details
                </h2>

                {/* Persona toggle */}
                <div
                  style={{ display: 'flex', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}
                >
                  {(
                    [
                      { key: 'manage', label: 'I manage projects' },
                      { key: 'professional', label: 'I am a construction professional' },
                    ] as { key: Persona; label: string }[]
                  ).map((opt) => {
                    const active = persona === opt.key;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => selectPersona(opt.key)}
                        style={{
                          flex: '1 1 auto',
                          padding: '12px 16px',
                          fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                          fontWeight: 400,
                          fontSize: '12px',
                          letterSpacing: '0.04em',
                          color: active ? '#0A1628' : 'rgba(10,22,40,0.6)',
                          backgroundColor: active ? '#C9A84C' : 'transparent',
                          border: '0.5px solid #C9A84C',
                          borderRadius: 0,
                          cursor: 'pointer',
                          transition: 'background-color 0.2s ease, color 0.2s ease',
                        }}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>

                {/* Two-column row: Full Name + Company */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '28px',
                  }}
                >
                  <Field
                    label="Full Name"
                    name="fullName"
                    type="text"
                    value={values.fullName}
                    onChange={handleChange}
                    placeholder="Alex Morgan"
                  />
                  <Field
                    label="Company Name"
                    name="companyName"
                    type="text"
                    value={values.companyName}
                    onChange={handleChange}
                    placeholder="(optional for freelancers)"
                    required={false}
                  />
                </div>

                {/* Two-column row: Job Title + Work Email */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '28px',
                  }}
                >
                  <Field
                    label="Job Title"
                    name="jobTitle"
                    type="text"
                    value={values.jobTitle}
                    onChange={handleChange}
                    placeholder="Project Director"
                  />
                  <Field
                    label="Work Email"
                    name="workEmail"
                    type="email"
                    value={values.workEmail}
                    onChange={handleChange}
                    placeholder="alex@company.com"
                  />
                </div>

                {/* Two-column row: Mobile + Country */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '28px',
                  }}
                >
                  <Field
                    label="Mobile Number"
                    name="mobileNumber"
                    type="tel"
                    value={values.mobileNumber}
                    onChange={handleChange}
                    placeholder="+1 555 000 0000"
                  />
                  <SelectField
                    label="Country"
                    name="country"
                    value={values.country}
                    onChange={handleChange}
                    options={COUNTRIES}
                  />
                </div>

                {/* Two-column row: Company Size + Primary Interest */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '24px',
                    marginBottom: '40px',
                  }}
                >
                  <SelectField
                    label="Company Size"
                    name="companySize"
                    value={values.companySize}
                    onChange={handleChange}
                    options={COMPANY_SIZES}
                  />
                  <SelectField
                    label="Primary Interest"
                    name="primaryInterest"
                    value={values.primaryInterest}
                    onChange={handleChange}
                    options={PRIMARY_INTERESTS}
                  />
                </div>

                {/* Error message */}
                {error && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 400,
                      fontSize: '13px',
                      lineHeight: 1.5,
                      color: '#9B2C2C',
                      marginBottom: '16px',
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  aria-busy={submitting}
                  style={{
                    width: '100%',
                    height: '60px',
                    backgroundColor: '#C9A84C',
                    color: '#0A1628',
                    border: 'none',
                    borderRadius: 0,
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 500,
                    fontSize: '14px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: submitting ? 'wait' : 'pointer',
                    opacity: submitting ? 0.7 : 1,
                    transition: 'background-color 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!submitting)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b8963f';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A84C';
                  }}
                >
                  {submitting ? 'Sending…' : 'Request Access →'}
                </button>

                {/* Legal */}
                <p
                  style={{
                    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    color: 'rgba(10,22,40,0.4)',
                    textAlign: 'center',
                    marginTop: '20px',
                    lineHeight: 1.7,
                  }}
                >
                  By submitting, you agree to Bayty&apos;s{' '}
                  <Link
                    href="/terms"
                    style={{ color: 'rgba(10,22,40,0.55)', textDecoration: 'underline' }}
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    style={{ color: 'rgba(10,22,40,0.55)', textDecoration: 'underline' }}
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

/* ── Field components ── */

interface FieldProps {
  label: string;
  name: string;
  type: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function Field({ label, name, type, value, placeholder, required = true, onChange }: FieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={name}
        style={{
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(10,22,40,0.5)',
        }}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          ...fieldBase,
          color: '#0A1628',
        }}
      />
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  options: readonly string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

function SelectField({ label, name, value, options, onChange }: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label
        htmlFor={name}
        style={{
          fontFamily: "var(--font-mono, 'DM Mono', monospace)",
          fontSize: '10px',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(10,22,40,0.5)',
        }}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        required
        value={value}
        onChange={onChange}
        style={{
          ...fieldBase,
          color: value === '' ? 'rgba(10,22,40,0.4)' : '#0A1628',
          cursor: 'pointer',
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%23C9A84C' stroke-width='0.75'/%3E%3C/svg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 4px center',
          paddingRight: '24px',
        }}
      >
        <option value="" disabled>
          Select
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} style={{ color: '#0A1628', backgroundColor: '#F8F6F1' }}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
