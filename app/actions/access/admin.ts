'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export interface AccessRequest {
  id: string;
  organizationName: string;
  organizationType: string;
  contactName: string;
  email: string;
  phone: string | null;
  country: string;
  website: string | null;
  programName: string | null;
  programScale: string | null;
  message: string | null;
  status: 'new' | 'reviewing' | 'invited' | 'declined';
  createdAt: string;
}

/** Admin-only: list open access applications (new + reviewing). */
export async function listAccessRequests(): Promise<ActionResult<AccessRequest[]>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (actor.platformRole !== 'admin') return err('Forbidden');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data, error } = await supabase
    .from('access_requests')
    .select('*')
    .in('status', ['new', 'reviewing'])
    .order('created_at', { ascending: false });

  if (error) return err('Could not load access requests');

  return ok(
    (data ?? []).map((r) => ({
      id: r.id as string,
      organizationName: r.organization_name as string,
      organizationType: r.organization_type as string,
      contactName: r.contact_name as string,
      email: r.email as string,
      phone: (r.phone as string | null) ?? null,
      country: r.country as string,
      website: (r.website as string | null) ?? null,
      programName: (r.program_name as string | null) ?? null,
      programScale: (r.program_scale as string | null) ?? null,
      message: (r.message as string | null) ?? null,
      status: r.status as AccessRequest['status'],
      createdAt: r.created_at as string,
    })),
  );
}

/** Admin-only: mark an application invited or declined. */
export async function decideAccessRequest(input: {
  id: string;
  decision: 'invited' | 'declined';
}): Promise<ActionResult<undefined>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');
  if (actor.platformRole !== 'admin') return err('Forbidden');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { error } = await supabase
    .from('access_requests')
    .update({
      status: input.decision,
      reviewed_by: actor.userId,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', input.id);

  if (error) return err('Could not update the request');
  return ok(undefined);
}
