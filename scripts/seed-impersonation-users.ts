/**
 * Phase 3 — Seed impersonation users (one-time, dev/preview only).
 *
 * Creates one Supabase auth user per organization role, each provisioned with:
 *   - email_confirm: true and an unguessable random password that is NEVER
 *     stored or printed (these users never log in by email; the founder mints
 *     their session directly via the service-role key in Phase 4)
 *   - an APPROVED identity_verifications row (satisfies the KYC gate)
 *   - a membership in the single "Impersonation Demo Org" at the target role
 *     (satisfies the org-membership + RBAC gates once the JWT hook runs)
 *
 * The demo org is provisioned on the configured plan tier (enterprise).
 *
 * Run with:
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/seed-impersonation-users.ts
 * (or: pnpm seed:impersonation)
 *
 * Safety: refuses to run when NODE_ENV === 'production'. Idempotent — safe to
 * re-run; existing users/org/memberships are reused, not duplicated.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */
import { randomBytes } from 'node:crypto';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { DEMO_ORG, SEED_USERS, type ImpersonationRole } from '@/lib/auth/impersonation-config';

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

// ── Safety guards ───────────────────────────────────────────────────────────
if (process.env.NODE_ENV === 'production') {
  fail('Refusing to seed impersonation users in production (NODE_ENV=production).');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  fail(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Run with: node --env-file=.env.local node_modules/.bin/tsx scripts/seed-impersonation-users.ts',
  );
}

const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// ── Helpers ─────────────────────────────────────────────────────────────────

/** Find an existing auth user by email by paging through admin.listUsers. */
async function findUserByEmail(email: string): Promise<string | null> {
  const target = email.toLowerCase();
  // The roster is tiny, but page defensively in case the project has many users.
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`listUsers failed: ${error.message}`);
    const match = data.users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (match) return match.id;
    if (data.users.length < 200) break; // last page
  }
  return null;
}

/** Create (or reuse) an auth user. Returns the user id. */
async function ensureAuthUser(email: string, fullName: string): Promise<string> {
  const existing = await findUserByEmail(email);
  if (existing) {
    console.log(`  · auth user exists: ${email}`);
    return existing;
  }
  const { data, error } = await admin.auth.admin.createUser({
    email,
    // Unguessable, never stored or shared. Email login is never used for these.
    password: randomBytes(48).toString('base64url'),
    email_confirm: true,
    user_metadata: { full_name: fullName, impersonation_seed: true },
  });
  if (error || !data.user) fail(`createUser(${email}) failed: ${error?.message ?? 'no user'}`);
  console.log(`  ✓ created auth user: ${email}`);
  return data.user.id;
}

/** Create (or reuse) the demo organization. Returns its id. */
async function ensureDemoOrg(createdBy: string): Promise<string> {
  const { data: existing, error: selErr } = await admin
    .from('organizations')
    .select('id')
    .eq('slug', DEMO_ORG.slug)
    .maybeSingle();
  if (selErr) fail(`select organizations failed: ${selErr.message}`);
  if (existing) {
    console.log(`  · demo org exists: ${DEMO_ORG.slug}`);
    // Keep the tier in sync with config on re-run.
    await admin.from('organizations').update({ tier: DEMO_ORG.tier }).eq('id', existing.id);
    return existing.id as string;
  }
  const { data, error } = await admin
    .from('organizations')
    .insert({
      name: DEMO_ORG.name,
      slug: DEMO_ORG.slug,
      tier: DEMO_ORG.tier,
      created_by: createdBy,
    })
    .select('id')
    .single();
  if (error || !data) fail(`insert organization failed: ${error?.message ?? 'no row'}`);
  console.log(`  ✓ created demo org: ${DEMO_ORG.slug} (tier=${DEMO_ORG.tier})`);
  return data.id as string;
}

/** Upsert an APPROVED identity verification for a user. */
async function ensureApprovedKyc(userId: string, fullName: string, email: string): Promise<void> {
  const { error } = await admin.from('identity_verifications').upsert(
    {
      user_id: userId,
      full_name: fullName,
      email,
      status: 'approved',
      reviewed_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );
  if (error) fail(`upsert identity_verification(${email}) failed: ${error.message}`);
}

/** Upsert a membership for a user in the demo org at the given role. */
async function ensureMembership(
  orgId: string,
  userId: string,
  role: ImpersonationRole,
): Promise<void> {
  const { error } = await admin
    .from('memberships')
    .upsert(
      { organization_id: orgId, user_id: userId, role, status: 'active' },
      { onConflict: 'organization_id,user_id' },
    );
  if (error) fail(`upsert membership(${role}) failed: ${error.message}`);
}

// ── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\nSeeding impersonation users…\n');

  // The org's created_by must reference a real user. Use the owner seed user,
  // so create the owner first, then the org, then everyone's KYC + membership.
  const ownerCfg = SEED_USERS.find((u) => u.role === 'owner');
  if (!ownerCfg) fail('No owner role found in SEED_USERS config.');

  const ownerId = await ensureAuthUser(ownerCfg.email, ownerCfg.fullName);
  const orgId = await ensureDemoOrg(ownerId);

  for (const cfg of SEED_USERS) {
    const userId = cfg.role === 'owner' ? ownerId : await ensureAuthUser(cfg.email, cfg.fullName);
    await ensureApprovedKyc(userId, cfg.fullName, cfg.email);
    await ensureMembership(orgId, userId, cfg.role);
    console.log(`  ✓ provisioned ${cfg.role.padEnd(8)} → KYC approved + membership`);
  }

  console.log(
    `\n✓ Done. Demo org "${DEMO_ORG.name}" (${DEMO_ORG.tier}) with ${SEED_USERS.length} role users.\n` +
      'Reminder: enable the Supabase JWT custom-access-token hook so org_role lands in the JWT.\n',
  );
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
