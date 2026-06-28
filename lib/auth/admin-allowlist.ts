/**
 * Admin impersonation allowlist — Layer 2 of the four-layer security gate.
 *
 * This list is intentionally hardcoded in source (NOT an env var) so it cannot
 * be widened at runtime by a misconfigured environment. Only emails in this
 * list may ever use the dev/preview-only role-impersonation tooling.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */
export const ADMIN_EMAILS = ['info@baytyai.com'] as const;

/**
 * Returns true iff the given email belongs to the admin allowlist.
 * Comparison is case-insensitive and trims surrounding whitespace; a null/
 * undefined/empty email is always denied.
 */
export function isAllowlistedAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return ADMIN_EMAILS.some((allowed) => allowed.toLowerCase() === normalized);
}
