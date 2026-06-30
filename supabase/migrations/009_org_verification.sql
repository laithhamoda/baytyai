-- =============================================================================
-- Migration 009: Organization verification (manual, admin-granted)
--
-- Verification is granted ONLY by a platform admin. An org owner requests
-- verification; an admin approves or rejects. Only verified orgs may transact
-- in the marketplace (enforced in the server actions via is_org_verified()).
-- Additive; down-migration documented at the bottom.
-- =============================================================================

alter table public.organizations
  add column if not exists verification_status text not null default 'unverified'
    check (verification_status in ('unverified','pending','verified','rejected')),
  add column if not exists verification_requested_at timestamptz,
  add column if not exists verified_at   timestamptz,
  add column if not exists verified_by   uuid references auth.users(id),
  add column if not exists verification_notes text;

-- True when a given org is verified. SECURITY DEFINER so it can be used inside
-- RLS / server checks regardless of the caller's own row visibility.
create or replace function public.is_org_verified(org uuid) returns boolean
language sql stable security definer set search_path = public, pg_catalog as $$
  select exists (
    select 1 from public.organizations o
    where o.id = org and o.verification_status = 'verified'
  );
$$;

-- True when the CALLER's current org is verified.
create or replace function public.current_org_verified() returns boolean
language sql stable security definer set search_path = public, pg_catalog as $$
  select public.is_org_verified(public.current_org_id());
$$;

-- An org owner/member requests verification for their current org. SECURITY
-- DEFINER so it works without granting members blanket UPDATE on organizations.
-- Only flips an unverified/rejected org to 'pending'; never self-verifies.
create or replace function public.request_org_verification(notes text default null)
returns text
language plpgsql security definer set search_path = public, pg_catalog as $$
declare
  v_org uuid := public.current_org_id();
  v_status text;
begin
  if v_org is null then
    raise exception 'No organization for the current user';
  end if;
  select verification_status into v_status from public.organizations where id = v_org;
  if v_status = 'verified' then
    return 'verified';
  end if;
  update public.organizations
    set verification_status = 'pending',
        verification_requested_at = now(),
        verification_notes = coalesce(notes, verification_notes)
    where id = v_org;
  return 'pending';
end $$;

-- Restrict the request RPC to signed-in users only.
revoke execute on function public.request_org_verification(text) from anon;

-- =============================================================================
-- DOWN (manual): drop the two helper functions and request RPC, then
--   alter table public.organizations drop column verification_status, ... ;
-- =============================================================================
