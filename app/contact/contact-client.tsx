'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

import { trackEvent } from '@/lib/analytics';

interface FormValues {
  fullName: string;
  organisation: string;
  workEmail: string;
  enquiryType: string;
  message: string;
}

const EMPTY: FormValues = {
  fullName: '',
  organisation: '',
  workEmail: '',
  enquiryType: '',
  message: '',
};

const ENQUIRY_TYPES = [
  'Enterprise account',
  'Government entity',
  'White-label / corporate',
  'Partnership',
  'Other',
];

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

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(10,22,40,0.5)',
  marginBottom: '6px',
  display: 'block',
};

export default function ContactClient() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, formType: 'contact' }),
      });
      if (!res.ok) throw new Error('Request failed');
      trackEvent('contact_submit', { enquiryType: values.enquiryType });
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again, or email info@baytyai.com.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ backgroundColor: '#0A1628', minHeight: '100vh', padding: '120px 48px' }}>
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
        {/* Left */}
        <div style={{ paddingTop: '48px' }}>
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
            Enterprise & Government
          </motion.p>
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
            Speak with our enterprise team
          </motion.h1>
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
            Corporate, white-label, and government accounts for GCC construction and real estate
            portfolios. Tell us about your requirements and our team will respond within one
            business day.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.24, ease: 'easeOut' }}
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: '12px',
              letterSpacing: '0.08em',
              color: 'rgba(201,168,76,0.7)',
            }}
          >
            Or email us directly:{' '}
            <a
              href="mailto:info@baytyai.com"
              style={{ color: '#C9A84C', textDecoration: 'underline' }}
            >
              info@baytyai.com
            </a>
          </motion.p>
        </div>

        {/* Right — form card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1, ease: 'easeOut' }}
          style={{ backgroundColor: '#F8F6F1', padding: '48px', borderRadius: 0 }}
        >
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  minHeight: '440px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
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
                  Thank you. Our enterprise team will be in touch within one business day.
                </p>
                <span
                  style={{
                    display: 'block',
                    width: '40px',
                    height: '0.5px',
                    backgroundColor: '#C9A84C',
                  }}
                />
              </motion.div>
            ) : (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                exit={{ opacity: 0 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontWeight: 600,
                    fontSize: '28px',
                    color: '#0A1628',
                    marginBottom: '8px',
                  }}
                >
                  Tell us about your needs
                </h2>

                <div>
                  <label htmlFor="fullName" style={labelStyle}>
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    required
                    value={values.fullName}
                    onChange={handleChange}
                    placeholder="Khalid Al Rashid"
                    style={fieldBase}
                  />
                </div>

                <div>
                  <label htmlFor="organisation" style={labelStyle}>
                    Organisation
                  </label>
                  <input
                    id="organisation"
                    name="organisation"
                    type="text"
                    required
                    value={values.organisation}
                    onChange={handleChange}
                    placeholder="Government entity or company"
                    style={fieldBase}
                  />
                </div>

                <div>
                  <label htmlFor="workEmail" style={labelStyle}>
                    Work Email
                  </label>
                  <input
                    id="workEmail"
                    name="workEmail"
                    type="email"
                    required
                    value={values.workEmail}
                    onChange={handleChange}
                    placeholder="khalid@organisation.ae"
                    style={fieldBase}
                  />
                </div>

                <div>
                  <label htmlFor="enquiryType" style={labelStyle}>
                    Enquiry Type
                  </label>
                  <select
                    id="enquiryType"
                    name="enquiryType"
                    required
                    value={values.enquiryType}
                    onChange={handleChange}
                    style={{
                      ...fieldBase,
                      color: values.enquiryType === '' ? 'rgba(10,22,40,0.4)' : '#0A1628',
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
                    {ENQUIRY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" style={labelStyle}>
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    value={values.message}
                    onChange={handleChange}
                    placeholder="Tell us about your portfolio and requirements"
                    rows={4}
                    style={{
                      ...fieldBase,
                      height: 'auto',
                      paddingTop: '12px',
                      resize: 'vertical',
                      lineHeight: 1.6,
                    }}
                  />
                </div>

                {error && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontSize: '13px',
                      color: '#9B2C2C',
                      marginTop: '-8px',
                    }}
                  >
                    {error}
                  </p>
                )}

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
                  {submitting ? 'Sending…' : 'Send Enquiry →'}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
