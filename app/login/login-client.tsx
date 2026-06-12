'use client';

import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'sent';

const NAVY = '#0A1628';
const GOLD = '#C9A84C';
const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";
const serif = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";

const field: React.CSSProperties = {
  width: '100%',
  height: '52px',
  backgroundColor: 'transparent',
  border: 'none',
  borderBottom: '0.5px solid rgba(201,168,76,0.5)',
  borderRadius: 0,
  color: '#F8F6F1',
  fontFamily: sans,
  fontWeight: 300,
  fontSize: '16px',
  padding: '0 0 0 2px',
  outline: 'none',
  letterSpacing: '0.02em',
};

export default function LoginClient() {
  const params = useSearchParams();
  const next = params.get('next') || '/dashboard';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Surface auth_failed error from callback redirect
  const callbackError = params.get('error');

  async function sendLink(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not yet enabled. Please try again later.');
      return;
    }
    setBusy(true);
    const redirectTo =
      `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setStep('sent');
  }

  return (
    <div
      style={{
        backgroundColor: NAVY,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 64px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{ width: '100%', maxWidth: '420px' }}
      >
        <div
          style={{ width: '40px', height: '0.5px', backgroundColor: GOLD, margin: '0 auto 32px' }}
        />
        <h1
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: '40px',
            lineHeight: 1.1,
            color: '#F8F6F1',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {step === 'email' ? 'Sign in to Bayty' : 'Check your email'}
        </h1>
        <p
          style={{
            fontFamily: sans,
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(248,246,241,0.5)',
            textAlign: 'center',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          {step === 'email'
            ? "Enter your email and we'll send you a sign-in link."
            : `We sent a sign-in link to ${email}. Click it to continue — it expires in 10 minutes.`}
        </p>

        {(callbackError || error) && (
          <p role="alert" style={{ ...errStyle, marginBottom: '24px', textAlign: 'center' }}>
            {callbackError === 'auth_failed'
              ? 'That link has expired or already been used. Request a new one below.'
              : error}
          </p>
        )}

        {step === 'email' ? (
          <form
            onSubmit={sendLink}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            <div>
              <label htmlFor="email" style={labelStyle}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.ae"
                style={field}
                data-testid="login-email"
              />
            </div>
            <button type="submit" disabled={busy} style={btn(busy)} data-testid="login-submit">
              {busy ? 'Sending…' : 'Send sign-in link'}
            </button>
          </form>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}>
            <p style={{ fontFamily: sans, fontSize: '13px', color: 'rgba(248,246,241,0.4)' }}>
              Didn&apos;t receive it? Check your spam folder, or
            </p>
            <button
              type="button"
              onClick={() => { setStep('email'); setError(''); }}
              style={{
                background: 'none',
                border: 'none',
                color: GOLD,
                fontFamily: sans,
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              send a new link
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  fontSize: '10px',
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: 'rgba(248,246,241,0.5)',
  marginBottom: '6px',
  display: 'block',
};

const errStyle: React.CSSProperties = {
  fontFamily: sans,
  fontSize: '13px',
  color: '#C87878',
  lineHeight: 1.5,
};

function btn(busy: boolean): React.CSSProperties {
  return {
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
    cursor: busy ? 'wait' : 'pointer',
    opacity: busy ? 0.7 : 1,
  };
}
