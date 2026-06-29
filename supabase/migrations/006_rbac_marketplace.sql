-- =============================================================================
-- Migration 006: 6-role access model + approval engine + marketplace primitives
--
-- Adds:
--   * organizations.stakeholder_type (client|consultant|contractor|subcontractor|supplier)
--   * inquiries, quotations, approvals tables
--   * helper functions for RLS (platform admin, caller's org, caller's stakeholder type)
--   * RLS policies keyed to (auth.uid -> org, stakeholder_type, profiles.role='admin')
--
-- Additive only. A matching down-migration is provided at the bottom (commented)
-- so the change is reversible without data loss in the trial window.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. Stakeholder type on organizations
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'stakeholder_type') then
    create type public.stakeholder_type as enum
      ('client', 'consultant', 'contractor', 'subcontractor', 'supplier');
  end if;
end $$;

alter table public.organizations
  add column if not exists stakeholder_type public.stakeholder_type
    not null default 'client';

-- ---------------------------------------------------------------------------
-- 2. RLS helper functions (security definer, stable)
-- ---------------------------------------------------------------------------

-- True if the current auth user is a platform admin.
create or replace function public.is_platform_admin()
returns boolean language sql stable security definer as $$
  select coalesce(
    (select p.role = 'admin' from public.profiles p where p.id = auth.uid()),
    false
  );
$$;

-- The current auth user's active organization id (first active membership).
create or replace function public.current_org_id()
returns uuid language sql stable security definer as $$
  select m.organization_id
  from public.memberships m
  where m.user_id = auth.uid() and m.status = 'active'
  order by m.created_at asc
  limit 1;
$$;

-- The current auth user's organization stakeholder type.
create or replace function public.current_stakeholder_type()
returns public.stakeholder_type language sql stable security definer as $$
  select o.stakeholder_type
  from public.organizations o
  where o.id = public.current_org_id();
$$;

-- ---------------------------------------------------------------------------
-- 3. Inquiries (RFQ posts)
-- ---------------------------------------------------------------------------
create table if not exists public.inquiries (
  id               uuid        primary key default gen_random_uuid(),
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  created_by       uuid        not null references auth.users(id),
  title            text        not null,
  description      text        not null default '',
  region           text,
  budget_band      text,
  status           text        not null default 'draft'
                   check (status in ('draft', 'pending_approval', 'published', 'closed')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.inquiries enable row level security;

-- Read: published inquiries are visible to all authenticated users; an org sees
-- its own inquiries in any status; admins see everything.
drop policy if exists "inquiries_select" on public.inquiries;
create policy "inquiries_select" on public.inquiries for select using (
  public.is_platform_admin()
  or status = 'published'
  or organization_id = public.current_org_id()
);

-- Insert: only into your own org.
drop policy if exists "inquiries_insert" on public.inquiries;
create policy "inquiries_insert" on public.inquiries for insert with check (
  organization_id = public.current_org_id() or public.is_platform_admin()
);

-- Update: own org or admin (status transitions enforced in server actions + approvals).
drop policy if exists "inquiries_update" on public.inquiries;
create policy "inquiries_update" on public.inquiries for update using (
  organization_id = public.current_org_id() or public.is_platform_admin()
);

-- ---------------------------------------------------------------------------
-- 4. Quotations (responses to inquiries)
-- ---------------------------------------------------------------------------
create table if not exists public.quotations (
  id               uuid        primary key default gen_random_uuid(),
  inquiry_id       uuid        not null references public.inquiries(id) on delete cascade,
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  created_by       uuid        not null references auth.users(id),
  amount           numeric(14,2),
  currency         text        not null default 'USD',
  notes            text        not null default '',
  status           text        not null default 'draft'
                   check (status in ('draft', 'submitted', 'under_review', 'awarded', 'rejected')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
alter table public.quotations enable row level security;

-- Read: the quoting org sees its own quotations; the org that owns the inquiry
-- sees submitted+ quotations on it; admins see everything. Drafts stay private
-- to the quoting org.
drop policy if exists "quotations_select" on public.quotations;
create policy "quotations_select" on public.quotations for select using (
  public.is_platform_admin()
  or organization_id = public.current_org_id()
  or (
    status <> 'draft'
    and exists (
      select 1 from public.inquiries i
      where i.id = quotations.inquiry_id
        and i.organization_id = public.current_org_id()
    )
  )
);

drop policy if exists "quotations_insert" on public.quotations;
create policy "quotations_insert" on public.quotations for insert with check (
  organization_id = public.current_org_id() or public.is_platform_admin()
);

drop policy if exists "quotations_update" on public.quotations;
create policy "quotations_update" on public.quotations for update using (
  organization_id = public.current_org_id()
  or public.is_platform_admin()
  or exists (
    select 1 from public.inquiries i
    where i.id = quotations.inquiry_id
      and i.organization_id = public.current_org_id()
  )
);

-- ---------------------------------------------------------------------------
-- 5. Approvals (generic engine: entity_type + entity_id)
-- ---------------------------------------------------------------------------
create table if not exists public.approvals (
  id               uuid        primary key default gen_random_uuid(),
  entity_type      text        not null,   -- 'inquiry' | 'quotation' | 'project' | 'document' | ...
  entity_id        uuid        not null,
  organization_id  uuid        references public.organizations(id) on delete cascade,
  requested_by     uuid        not null references auth.users(id),
  approver_role    text        not null default 'admin',  -- who may decide
  status           text        not null default 'pending'
                   check (status in ('pending', 'approved', 'rejected')),
  reason           text,
  decided_by       uuid        references auth.users(id),
  decided_at       timestamptz,
  created_at       timestamptz not null default now()
);
alter table public.approvals enable row level security;

-- Read: requester's org sees its own approval requests; admins see all.
drop policy if exists "approvals_select" on public.approvals;
create policy "approvals_select" on public.approvals for select using (
  public.is_platform_admin() or organization_id = public.current_org_id()
);

-- Insert: into your own org.
drop policy if exists "approvals_insert" on public.approvals;
create policy "approvals_insert" on public.approvals for insert with check (
  organization_id = public.current_org_id() or public.is_platform_admin()
);

-- Decide (update): only platform admins in the trial (approver_role='admin').
drop policy if exists "approvals_update" on public.approvals;
create policy "approvals_update" on public.approvals for update using (
  public.is_platform_admin()
);

create index if not exists approvals_entity_idx on public.approvals (entity_type, entity_id);
create index if not exists approvals_status_idx on public.approvals (status);
create index if not exists inquiries_status_idx on public.inquiries (status);
create index if not exists quotations_inquiry_idx on public.quotations (inquiry_id);

-- =============================================================================
-- DOWN MIGRATION (manual; uncomment to reverse)
-- =============================================================================
-- drop table if exists public.approvals;
-- drop table if exists public.quotations;
-- drop table if exists public.inquiries;
-- alter table public.organizations drop column if exists stakeholder_type;
-- drop type if exists public.stakeholder_type;
-- drop function if exists public.current_stakeholder_type();
-- drop function if exists public.current_org_id();
-- drop function if exists public.is_platform_admin();
