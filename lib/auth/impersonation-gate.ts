import { timingSafeEqual } from 'node:crypto';

/**
 * Impersonation security gates — Layers 1 and 3 of the four-layer model.
 * See docs/adr/0001-admin-role-impersonation.md.
 *
 * These functions are deliberately pure and environment-driven so they can be
 * unit-tested by setting/overriding the relevant variables. Each returns a
 * boolean; the API route translates any failure into a 404 (notFound()), never
 * a 403 — we never reveal that the feature exists.
 */

/**
 * Layer 1 — Environment gate.
 *
 * Requires BOTH:
 *  - NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION === 'true' (explicit opt-in), and
 *  - NODE_ENV !== 'production' (redundant belt-and-suspenders guard).
 *
 * The redundant NODE_ENV check means that even if the public flag were
 * accidentally set in a production build, impersonation still stays off.
 */
export function isImpersonationEnvEnabled(env: NodeJS.ProcessEnv = process.env): boolean {
  const flag = env.NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION === 'true';
  const nonProd = env.NODE_ENV !== 'production';
  return flag && nonProd;
}

/**
 * Layer 3 — Shared-secret header check.
 *
 * Compares the request-supplied token against IMPERSONATION_SECRET using a
 * constant-time comparison to avoid leaking the secret via timing. Returns
 * false if either side is missing/empty or if lengths differ.
 *
 * A secret header (rather than a cookie) is used so the check is NOT satisfied
 * automatically by a browser carrying the founder's session cookies — defeating
 * CSRF / drive-by requests.
 */
export function isValidImpersonationToken(
  provided: string | null | undefined,
  expected: string | null | undefined = process.env.IMPERSONATION_SECRET,
): boolean {
  if (!provided || !expected) return false;

  const a = Buffer.from(provided, 'utf8');
  const b = Buffer.from(expected, 'utf8');

  // timingSafeEqual throws if lengths differ; guard first (length itself is not
  // secret, and an attacker learns nothing useful from a length mismatch).
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
