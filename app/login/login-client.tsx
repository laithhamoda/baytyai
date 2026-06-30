'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { createClient } from '@/lib/supabase/client';

type Step = 'email' | 'code';

const fieldCls =
  'w-full border-b border-bayty-500/40 bg-transparent px-1 py-3 text-base text-steel-900 placeholder:text-steel-500 focus:border-bayty-500 focus:outline-none';
const labelCls = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500';
const btnCls =
  'h-14 w-full bg-bayty-500 font-sans text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-bayty-600 disabled:cursor-wait disabled:opacity-70';

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
    const trimmed = code.trim();
    // Try the email-OTP type first; fall back to magiclink token type, since
    // signInWithOtp under the PKCE flow can issue either depending on config.
    let { error } = await supabase.auth.verifyOtp({
      email,
      token: trimmed,
      type: 'email',
    });
    if (error) {
      const retry = await supabase.auth.verifyOtp({
        email,
        token: trimmed,
        type: 'magiclink',
      });
      error = retry.error;
    }
    setBusy(false);
    if (error) {
      // Surface the real reason so failures are diagnosable, not generic.
      setError(`${error.message} (code ${error.status ?? '?'})`);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-steel-50 px-6 pb-16 pt-32">
      <div className="w-full max-w-[420px]">
        <div className="mx-auto mb-8 h-px w-10 bg-bayty-500" />
        <h1 className="mb-3 text-center font-sans text-3xl font-semibold text-steel-900">
          {step === 'email' ? (
            <>
              Sign in to Bayty<span className="text-bayty-600">AI</span>
            </>
          ) : (
            'Enter your code'
          )}
        </h1>
        <p className="mb-12 text-center font-sans text-sm leading-relaxed text-steel-600">
          {step === 'email' ? "Enter your email and we'll send a one-time code." : notice}
        </p>

        {step === 'email' ? (
          <form onSubmit={sendCode} className="flex flex-col gap-7">
            <div>
              <label htmlFor="email" className={labelCls}>
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
                className={fieldCls}
              />
            </div>
            {error && (
              <p role="alert" className="font-sans text-sm leading-snug text-alert-500">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className={btnCls}>
              {busy ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="flex flex-col gap-7">
            <div>
              <label htmlFor="code" className={labelCls}>
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
                className={`${fieldCls} text-[22px] tracking-[0.4em]`}
              />
            </div>
            {error && (
              <p role="alert" className="font-sans text-sm leading-snug text-alert-500">
                {error}
              </p>
            )}
            <button type="submit" disabled={busy} className={btnCls}>
              {busy ? 'Verifying…' : 'Verify and continue'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setCode('');
                setError('');
              }}
              className="font-sans text-sm text-steel-600 underline transition-colors hover:text-bayty-600"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
