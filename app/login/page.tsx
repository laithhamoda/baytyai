import { Suspense } from 'react';

import LoginClient from './login-client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { absolute: 'Sign in — BaytyAI' },
  description: 'Sign in to BaytyAI with your email and a one-time code.',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginClient />
    </Suspense>
  );
}
