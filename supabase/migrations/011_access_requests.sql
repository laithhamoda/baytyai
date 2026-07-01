-- =============================================================================
-- Migration 011: Enterprise "Request Access" applications
--
-- Public prospects (not signed in) submit an access application for their
-- organization; a platform admin reviews and invites/declines. Anonymous
-- INSERT is allowed (with check true) but only admins can read/update.
-- =============================================================================

create table if not exists public.access_requests (
  id                 uuid primary key default gen_random_uuid(),
  organization_name  text not null,
  organization_type  text not null,          -- government / owner-developer / consultant / contractor / subcontractor / supplier
  contact_name       text not null,
  email              text not null,
  phone              text,
  country            text not null,
  website            text,
  program_name       text,                    -- flagship program / project
  program_scale      text,                    -- budget band
  message            text,
  status             text not null default 'new'
                       check (status in ('new','reviewing','invited','declined')),
  created_at         timestamptz not null default now(),
  reviewed_by        uuid references auth.users(id),
  reviewed_at        timestamptz
);

alter table public.access_requests enable row level security;

-- Admins: full access.
drop policy if exists access_requests_admin on public.access_requests;
create policy access_requests_admin on public.access_requests for all
  using (public.is_platform_admin()) with check (public.is_platform_admin());

-- Anyone (incl. anonymous prospects) may submit an application — insert only,
-- never read. No SELECT/UPDATE/DELETE for non-admins.
drop policy if exists access_requests_public_insert on public.access_requests;
create policy access_requests_public_insert on public.access_requests for insert
  with check (true);

create index if not exists access_requests_status_idx
  on public.access_requests(status, created_at desc);

-- =============================================================================
-- DOWN (manual): drop table public.access_requests;
-- =============================================================================
