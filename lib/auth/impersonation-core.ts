import { createClient as createAdminJsClient } from '@supabase/supabase-js';

import { isAllowlistedAdmin } from '@/lib/auth/admin-allowlist';
import { writeImpersonationAudit, type AuditInsertClient } from '@/lib/auth/impersonation-audit';
import { seedEmailFor, type ImpersonationRole } from '@/lib/auth/impersonation-config';
import {
  isImpersonationEnvEnabled,
  isValidImpersonationToken,
} from '@/lib/auth/impersonation-gate';
import { stashFounderTokens, resolveStashedFounder } from '@/lib/auth/impersonation-session';
import { createClient as createCookieClient } from '@/lib/supabase/server';

/**
 * Core role-impersonation logic — Phase 4.
 *
 * Runs the four security gates and, on success, mints a REAL Supabase session
 * for the selected role's seed user by setting session cookies on the current
 * server context. Both the HTTP route and the founder-only server action call
 * this so the gate logic lives in exactly one place.
 *
 * Any gate failure resolves to { ok: false, status: 404 } — callers translate
 * that into a 404 so the feature's existence is never revealed.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */

export interface ImpersonationRequestContext {
  targetRole: ImpersonationRole;
  /** Value of the x-impersonation-token header (HTTP route) or the secret read
   *  server-side (trusted server action). */
  providedToken: string | null | undefined;
  sourceIp?: string | null;
  userAgent?: string | null;
}

export type ImpersonationOutcome = { ok: true; status: 200 } | { ok: false; status: 404 };

/** Service-role client for the privileged Admin API (generateLink) + audit. */
function adminJsClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createAdminJsClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export async function performImpersonation(
  ctx: ImpersonationRequestContext,
): Promise<ImpersonationOutcome> {
  const admin = adminJsClient();
  const auditClient = admin as unknown as AuditInsertClient | null;

  // We collect the requester identity early so denials are still attributable.
  let requesterId: string | null = null;
  let requesterEmail: string | null = null;

  const deny = async (detail: string): Promise<ImpersonationOutcome> => {
    await writeImpersonationAudit(auditClient, {
      requestedBy: requesterId,
      requesterEmail,
      targetRole: ctx.targetRole,
      sourceIp: ctx.sourceIp ?? null,
      userAgent: ctx.userAgent ?? null,
      result: 'denied',
      detail,
    });
    return { ok: false, status: 404 };
  };

  const error = async (detail: string): Promise<ImpersonationOutcome> => {
    await writeImpersonationAudit(auditClient, {
      requestedBy: requesterId,
      requesterEmail,
      targetRole: ctx.targetRole,
      sourceIp: ctx.sourceIp ?? null,
      userAgent: ctx.userAgent ?? null,
      result: 'error',
      detail,
    });
    return { ok: false, status: 404 };
  };

  // ── Layer 1 — Environment gate ──────────────────────────────────────────
  if (!isImpersonationEnvEnabled()) {
    return deny('layer1:env-disabled');
  }

  // Identify the current (founder) session.
  const cookieClient = await createCookieClient();
  if (!cookieClient) return error('no-cookie-client');
  const {
    data: { session },
  } = await cookieClient.auth.getSession();
  const liveUser = session?.user ?? null;
  requesterId = liveUser?.id ?? null;
  requesterEmail = liveUser?.email ?? null;

  // ── Layer 2 — Admin allowlist ───────────────────────────────────────────
  // The founder is allowlisted via EITHER their live session OR a previously
  // stashed founder identity (so they can switch roles repeatedly after their
  // own cookies were replaced by a seed user's session).
  if (isAllowlistedAdmin(requesterEmail) && session) {
    // First impersonation in this chain: stash the founder's real tokens so
    // they can return to admin / keep switching.
    await stashFounderTokens({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  } else {
    const stashed = await resolveStashedFounder();
    if (!stashed) {
      return deny('layer2:not-allowlisted');
    }
    requesterId = stashed.id;
    requesterEmail = stashed.email;
  }

  // ── Layer 3 — Shared-secret header ──────────────────────────────────────
  if (!isValidImpersonationToken(ctx.providedToken)) {
    return deny('layer3:bad-token');
  }

  if (!admin) return error('no-service-client');

  // ── Mint a real session for the seed user ───────────────────────────────
  const email = seedEmailFor(ctx.targetRole);
  const { data: linkData, error: linkErr } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  const hashedToken = linkData?.properties?.hashed_token;
  if (linkErr || !hashedToken) {
    return error(`generateLink:${linkErr?.message ?? 'no-hashed-token'}`);
  }

  // Verify the OTP on the cookie-writing client so session cookies are set on
  // the current server response, replacing the founder's session with the
  // seed user's real session.
  const { error: verifyErr } = await cookieClient.auth.verifyOtp({
    token_hash: hashedToken,
    type: 'magiclink',
  });
  if (verifyErr) {
    return error(`verifyOtp:${verifyErr.message}`);
  }

  // ── Layer 4 — Audit success ─────────────────────────────────────────────
  await writeImpersonationAudit(auditClient, {
    requestedBy: requesterId,
    requesterEmail,
    targetRole: ctx.targetRole,
    sourceIp: ctx.sourceIp ?? null,
    userAgent: ctx.userAgent ?? null,
    result: 'granted',
    detail: `impersonated:${ctx.targetRole}`,
  });

  return { ok: true, status: 200 };
}
