'use server';

import { ok, err } from '@/lib/actions/types';
import { resolveActor } from '@/lib/auth/resolve-actor';
import { createClient } from '@/lib/supabase/server';

import type { ActionResult } from '@/lib/actions/types';

export interface InquiryListItem {
  id: string;
  title: string;
  description: string;
  region: string | null;
  budgetBand: string | null;
  createdAt: string;
  isOwn: boolean;
}

export interface InquiryFilters {
  q?: string;
  region?: string;
  budgetBand?: string;
}

/**
 * Browse published marketplace inquiries. RLS exposes published inquiries to all
 * authenticated users; own-org inquiries are flagged so the UI can label them.
 */
export async function listPublishedInquiries(
  filters: InquiryFilters = {},
): Promise<ActionResult<InquiryListItem[]>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  let query = supabase
    .from('inquiries')
    .select('id, organization_id, title, description, region, budget_band, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(100);

  if (filters.region) query = query.eq('region', filters.region);
  if (filters.budgetBand) query = query.eq('budget_band', filters.budgetBand);
  if (filters.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    query = query.or(`title.ilike.${term},description.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) return err('Could not load marketplace');

  return ok(
    (data ?? []).map((r) => ({
      id: r.id as string,
      title: r.title as string,
      description: (r.description as string) ?? '',
      region: (r.region as string | null) ?? null,
      budgetBand: (r.budget_band as string | null) ?? null,
      createdAt: r.created_at as string,
      isOwn: r.organization_id === actor.orgId,
    })),
  );
}

export interface QuotationItem {
  id: string;
  amount: number;
  currency: string;
  notes: string;
  status: string;
  createdAt: string;
}

export interface InquiryDetail extends InquiryListItem {
  status: string;
  quotations: QuotationItem[]; // populated only for the inquiry owner
}

/** Load one inquiry. If the caller owns it, also return the quotations received. */
export async function getInquiryDetail(id: string): Promise<ActionResult<InquiryDetail>> {
  const actor = await resolveActor();
  if (!actor) return err('Unauthorized');

  const supabase = await createClient();
  if (!supabase) return err('Service unavailable');

  const { data: inq, error } = await supabase
    .from('inquiries')
    .select('id, organization_id, title, description, region, budget_band, status, created_at')
    .eq('id', id)
    .maybeSingle();
  if (error || !inq) return err('Inquiry not found');

  const isOwn = inq.organization_id === actor.orgId;
  let quotations: QuotationItem[] = [];
  if (isOwn) {
    const { data: quotes } = await supabase
      .from('quotations')
      .select('id, amount, currency, notes, status, created_at')
      .eq('inquiry_id', id)
      .order('created_at', { ascending: false });
    quotations = (quotes ?? []).map((q) => ({
      id: q.id as string,
      amount: Number(q.amount),
      currency: (q.currency as string) ?? 'USD',
      notes: (q.notes as string) ?? '',
      status: (q.status as string) ?? 'submitted',
      createdAt: q.created_at as string,
    }));
  }

  return ok({
    id: inq.id as string,
    title: inq.title as string,
    description: (inq.description as string) ?? '',
    region: (inq.region as string | null) ?? null,
    budgetBand: (inq.budget_band as string | null) ?? null,
    createdAt: inq.created_at as string,
    isOwn,
    status: inq.status as string,
    quotations,
  });
}
