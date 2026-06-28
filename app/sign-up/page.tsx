import { redirect } from 'next/navigation';

// Canonical auth is the Supabase email one-time-code flow at /login.
// /sign-up is kept as a stable URL and redirects there.
export default function SignUpPage() {
  redirect('/login');
}
