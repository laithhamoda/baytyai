import { createClient } from '@/lib/supabase/server';

import type { Actor } from './resolve-actor';

/**
 * Marketplace access gate: only verified organizations may transact. Platform
 * admins always pass. Returns true when the actor's org is verified.
 *
 * Verification is granted ONLY manually by a platform admin (migration 009),
 * so this is the single check that enforces "only verified orgs have access".
 */
export async function isOrgVerified(actor: Actor): Promise<boolean> {
  if (actor.platformRole === 'admin') return true;
  if (!actor.orgId) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from('organizations')
    .select('verification_status')
    .eq('id', actor.orgId)
    .single();

  return data?.verification_status === 'verified';
}
