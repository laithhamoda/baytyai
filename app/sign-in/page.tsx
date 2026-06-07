import AuthForm from '@/components/auth-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In — Bayty',
};

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
