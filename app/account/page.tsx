import Link from 'next/link';
import { redirect } from 'next/navigation';

import { signOutUser } from '@/app/admin/actions';
import { getSessionUser } from '@/lib/supabase/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Your account — Bayty' },
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) redirect('/login?next=/account');

  return (
    <div
      style={{
        backgroundColor: '#0A1628',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <div
          style={{
            width: '40px',
            height: '0.5px',
            backgroundColor: '#C9A84C',
            marginBottom: '32px',
          }}
        />
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: '40px',
            color: '#F8F6F1',
            marginBottom: '8px',
          }}
        >
          Your account
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: '14px',
            color: 'rgba(248,246,241,0.6)',
            marginBottom: '40px',
          }}
        >
          Signed in as {user.email}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {user.role === 'admin' && (
            <Link
              href="/admin"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '52px',
                backgroundColor: '#C9A84C',
                color: '#0A1628',
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 500,
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                borderRadius: 0,
              }}
            >
              Open admin
            </Link>
          )}
          <form action={signOutUser}>
            <button
              type="submit"
              style={{
                width: '100%',
                height: '52px',
                background: 'none',
                border: '0.5px solid #C9A84C',
                borderRadius: 0,
                color: '#C9A84C',
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 400,
                fontSize: '13px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
