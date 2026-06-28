import { redirect } from 'next/navigation';

// Canonical auth is the Supabase email one-time-code flow at /login.
// /sign-in is kept as a stable URL and redirects there.
export default function SignInPage() {
  redirect('/login');
}
