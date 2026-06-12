import type { OrgRole, OrgTier } from '@/lib/types/tenancy';

/**
 * Shared, typed configuration for the dev/preview-only role-impersonation
 * system. Consumed by both the seed script (Phase 3) and the session-minting
 * route (Phase 4) so the two never drift.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */

/** The five organization roles we provision seed users for. */
export const IMPERSONATION_ROLES = [
  'owner',
  'admin',
  'manager',
  'member',
  'viewer',
] as const satisfies readonly OrgRole[];

export type ImpersonationRole = (typeof IMPERSONATION_ROLES)[number];

export function isImpersonationRole(value: unknown): value is ImpersonationRole {
  return (
    typeof value === 'string' &&
    (IMPERSONATION_ROLES as readonly string[]).includes(value)
  );
}

/** Deterministic demo org these seed users belong to. */
export const DEMO_ORG = {
  name: 'Impersonation Demo Org',
  slug: 'impersonation-demo-org',
  /**
   * Plan tier the demo org is provisioned on. Enterprise for now (founder
   * decision: full access during the startup phase, to be tightened later).
   * Change this single value to review the experience on another tier.
   */
  tier: 'enterprise' as OrgTier,
} as const;

export interface SeedUserConfig {
  role: ImpersonationRole;
  /**
   * Internal identifier only. These users never log in by email — the founder
   * mints a session for them directly via the service-role key. The address is
   * a sub-address of the real domain, clearly labelled, and never receives mail.
   */
  email: string;
  fullName: string;
}

/** Email pattern: impersonation+{role}@baytyai.com (internal identifier only). */
export function seedEmailFor(role: ImpersonationRole): string {
  return `impersonation+${role}@baytyai.com`;
}

const FULL_NAME: Record<ImpersonationRole, string> = {
  owner: 'Demo Owner',
  admin: 'Demo Admin',
  manager: 'Demo Manager',
  member: 'Demo Member',
  viewer: 'Demo Viewer',
};

/** The full typed seed roster — one user per org role. */
export const SEED_USERS: readonly SeedUserConfig[] = IMPERSONATION_ROLES.map((role) => ({
  role,
  email: seedEmailFor(role),
  fullName: FULL_NAME[role],
}));
