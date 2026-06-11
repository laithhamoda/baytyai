'use client';

import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'code';

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
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/account';

  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not yet enabled. Please try again later.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setNotice(`We sent a sign-in code to ${email}.`);
    setStep('code');
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const supabase = createClient();
    if (!supabase) {
      setError('Sign-in is not yet enabled. Please try again later.');
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'email',
    });
    setBusy(false);
    if (error) {
      setError('That code is invalid or expired. Request a new one.');
      return;
    }
    router.push(next);
    router.refresh();
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
          {step === 'email' ? 'Sign in to Bayty' : 'Enter your code'}
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
          {step === 'email' ? "Enter your email and we'll send a one-time code." : notice}
        </p>

        {step === 'email' ? (
          <form
            onSubmit={sendCode}
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
              />
            </div>
            {error && (
              <p role="alert" style={errStyle}>
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} style={btn(busy)}>
              {busy ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form
            onSubmit={verifyCode}
            style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}
          >
            <div>
              <label htmlFor="code" style={labelStyle}>
                Sign-in code
              </label>
              <input
                id="code"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={10}
                required
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                style={{ ...field, letterSpacing: '0.4em', fontSize: '22px' }}
              />
            </div>
            {error && (
              <p role="alert" style={errStyle}>
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} style={btn(busy)}>
              {busy ? 'Verifying…' : 'Verify and continue'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(248,246,241,0.5)',
                fontFamily: sans,
                fontSize: '13px',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Use a different email
            </button>
          </form>
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
