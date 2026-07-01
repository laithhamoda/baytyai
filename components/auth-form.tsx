'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

import { signInLinkedIn } from '@/app/actions/auth';

export default function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const isSignUp = mode === 'sign-up';

  return (
    <div
      style={{
        backgroundColor: '#0A1628',
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
          style={{
            width: '40px',
            height: '0.5px',
            backgroundColor: '#C9A84C',
            margin: '0 auto 32px',
          }}
        />

        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: '40px',
            lineHeight: 1.1,
            color: '#F8F6F1',
            textAlign: 'center',
            marginBottom: '12px',
          }}
        >
          {isSignUp ? 'Create your account' : 'Sign in to Bayty'}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(248,246,241,0.5)',
            textAlign: 'center',
            marginBottom: '48px',
            lineHeight: 1.6,
          }}
        >
          {isSignUp
            ? 'Join Bayty using your verified LinkedIn profile.'
            : 'Continue with your LinkedIn account to access Bayty.'}
        </p>

        {/* LinkedIn sign-in (server action) */}
        <form action={signInLinkedIn}>
          <button
            type="submit"
            style={{
              width: '100%',
              height: '56px',
              backgroundColor: '#C9A84C',
              color: '#0A1628',
              border: 'none',
              borderRadius: 0,
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 500,
              fontSize: '13px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'background-color 0.25s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#b8963f';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#C9A84C';
            }}
          >
            <span
              aria-hidden
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 700,
                fontSize: '15px',
                lineHeight: 1,
              }}
            >
              in
            </span>
            Continue with LinkedIn
          </button>
        </form>

        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: '10px',
            letterSpacing: '0.08em',
            color: 'rgba(248,246,241,0.35)',
            textAlign: 'center',
            marginTop: '20px',
            lineHeight: 1.7,
          }}
        >
          Access is granted to verified construction professionals worldwide.
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            margin: '40px 0',
          }}
        >
          <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(201,168,76,0.2)' }} />
          <span
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: '10px',
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'rgba(248,246,241,0.35)',
            }}
          >
            or
          </span>
          <div style={{ flex: 1, height: '0.5px', backgroundColor: 'rgba(201,168,76,0.2)' }} />
        </div>

        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: '13px',
            color: 'rgba(248,246,241,0.5)',
            textAlign: 'center',
          }}
        >
          {isSignUp ? 'Prefer a manual introduction? ' : 'Not a member yet? '}
          <Link
            href="/request-access"
            style={{
              color: '#C9A84C',
              borderBottom: '0.5px solid rgba(201,168,76,0.4)',
              paddingBottom: '1px',
            }}
          >
            Request private access
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
