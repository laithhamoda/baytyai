import AuthForm from '@/components/auth-form';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Account — Bayty',
};

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
