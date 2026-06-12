'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

import { isImpersonationEnvEnabled } from '@/lib/auth/impersonation-gate';
import { isImpersonationRole } from '@/lib/auth/impersonation-config';
import { performImpersonation } from '@/lib/auth/impersonation-core';
import {
  readFounderTokens,
  clearFounderTokens,
} from '@/lib/auth/impersonation-session';
import { createClient } from '@/lib/supabase/server';

/**
 * Founder-only server actions for the role switcher (Phase 4).
 *
 * These run server-side and read IMPERSONATION_SECRET directly from the
 * environment (server-to-server trust), so the secret never reaches the
 * browser. The HTTP route (for Playwright/programmatic use) still requires the
 * x-impersonation-token header.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */

export async function impersonateRoleAction(formData: FormData): Promise<void> {
  if (!isImpersonationEnvEnabled()) redirect('/');

  const role = formData.get('role');
  if (!isImpersonationRole(role)) redirect('/');

  const hdrs = await headers();
  const outcome = await performImpersonation({
    targetRole: role,
    providedToken: process.env.IMPERSONATION_SECRET, // server-side trusted
    sourceIp:
      hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() ?? hdrs.get('x-real-ip'),
    userAgent: hdrs.get('user-agent'),
  });

  // On any failure we redirect home rather than reveal the feature.
  if (!outcome.ok) redirect('/');
  redirect('/dashboard');
}

export async function returnToAdminAction(): Promise<void> {
  if (!isImpersonationEnvEnabled()) redirect('/');

  const tokens = await readFounderTokens();
  if (!tokens) redirect('/');

  const supabase = await createClient();
  if (!supabase) redirect('/');

  // Restore the founder's real session cookies, then clear the stash.
  await supabase.auth.setSession({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
  });
  await clearFounderTokens();
  redirect('/account');
}
