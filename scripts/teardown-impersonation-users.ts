/**
 * Phase 6 — Teardown impersonation seed data (dev/preview only).
 *
 * Deletes the five seed auth users and the "Impersonation Demo Org". Membership
 * and identity_verifications rows are removed automatically via ON DELETE
 * CASCADE on the auth.users / organizations foreign keys.
 *
 * Run with:
 *   node --env-file=.env.local node_modules/.bin/tsx scripts/teardown-impersonation-users.ts
 * (or: pnpm teardown:impersonation)
 *
 * Safety: refuses to run when NODE_ENV === 'production'. Idempotent — missing
 * users/org are skipped without error.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { DEMO_ORG, SEED_USERS } from '@/lib/auth/impersonation-config';

function fail(message: string): never {
  console.error(`\n✗ ${message}\n`);
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  fail('Refusing to delete impersonation seed data in production (NODE_ENV=production).');
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  fail(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. ' +
      'Run with: node --env-file=.env.local node_modules/.bin/tsx scripts/teardown-impersonation-users.ts',
  );
}

const admin: SupabaseClient = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email: string): Promise<string | null> {
  const target = email.toLowerCase();
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) fail(`listUsers failed: ${error.message}`);
    const match = data.users.find((u) => (u.email ?? '').toLowerCase() === target);
    if (match) return match.id;
    if (data.users.length < 200) break;
  }
  return null;
}

async function main() {
  console.log('\nTearing down impersonation seed data…\n');

  // Delete the demo org first (cascades memberships); identity_verifications and
  // the auth users are removed when the users are deleted below.
  const { data: org } = await admin
    .from('organizations')
    .select('id')
    .eq('slug', DEMO_ORG.slug)
    .maybeSingle();
  if (org) {
    const { error } = await admin.from('organizations').delete().eq('id', org.id);
    if (error) fail(`delete organization failed: ${error.message}`);
    console.log(`  ✓ deleted demo org: ${DEMO_ORG.slug}`);
  } else {
    console.log(`  · demo org not found: ${DEMO_ORG.slug}`);
  }

  for (const cfg of SEED_USERS) {
    const userId = await findUserByEmail(cfg.email);
    if (!userId) {
      console.log(`  · user not found: ${cfg.email}`);
      continue;
    }
    const { error } = await admin.auth.admin.deleteUser(userId);
    if (error) fail(`deleteUser(${cfg.email}) failed: ${error.message}`);
    console.log(`  ✓ deleted auth user: ${cfg.email}`);
  }

  console.log('\n✓ Teardown complete.\n');
}

main().catch((err) => fail(err instanceof Error ? err.message : String(err)));
