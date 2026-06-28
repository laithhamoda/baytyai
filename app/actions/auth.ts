'use server';

import { redirect } from 'next/navigation';

import { signIn, signOut, auth } from '@/auth';

export async function signInLinkedIn() {
  const session = await auth();

  // If already authenticated, redirect to home
  if (session?.user) {
    redirect('/');
  }

  // Initiate OAuth flow
  await signIn('linkedin', { redirectTo: '/' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
