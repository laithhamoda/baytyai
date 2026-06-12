import { cookies } from 'next/headers';
import { createClient as createAdminJsClient } from '@supabase/supabase-js';

import { isAllowlistedAdmin } from '@/lib/auth/admin-allowlist';

/**
 * Founder-session stashing for role impersonation (Phase 4).
 *
 * Minting a seed user's session necessarily overwrites the founder's Supabase
 * cookies (cookies are per-domain — you cannot be two users at once). To let
 * the founder switch between roles and return to their admin identity, we stash
 * the founder's tokens in a separate httpOnly cookie before overwriting.
 *
 * The cookie is httpOnly + secure + sameSite=strict so it is never readable by
 * client JS and never sent cross-site. It holds Supabase tokens, not the
 * impersonation secret.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */

const FOUNDER_COOKIE = 'bayty_impersonator';

interface FounderTokens {
  access_token: string;
  refresh_token: string;
}

export interface FounderContext {
  id: string;
  email: string;
}

export async function stashFounderTokens(tokens: FounderTokens): Promise<void> {
  const store = await cookies();
  store.set(FOUNDER_COOKIE, JSON.stringify(tokens), {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 4, // 4 hours — a review session, not a standing grant
  });
}

export async function readFounderTokens(): Promise<FounderTokens | null> {
  const store = await cookies();
  const raw = store.get(FOUNDER_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as FounderTokens;
    if (parsed?.access_token && parsed?.refresh_token) return parsed;
    return null;
  } catch {
    return null;
  }
}

export async function clearFounderTokens(): Promise<void> {
  const store = await cookies();
  store.delete(FOUNDER_COOKIE);
}

/**
 * Resolve the stashed founder identity from the impersonator cookie and verify
 * it is allowlisted. Used so the founder can keep switching roles even after
 * their own session cookies have been replaced by a seed user's. Returns null
 * if there is no valid, allowlisted stashed founder.
 */
export async function resolveStashedFounder(): Promise<FounderContext | null> {
  const tokens = await readFounderTokens();
  if (!tokens) return null;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const admin = createAdminJsClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.getUser(tokens.access_token);
  if (error || !data.user) return null;
  const email = data.user.email ?? null;
  if (!isAllowlistedAdmin(email)) return null;
  return { id: data.user.id, email: email as string };
}
