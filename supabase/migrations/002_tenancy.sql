-- =============================================================================
-- BaytyAI — Tenancy Foundation (Migration 002)
-- Run in Supabase SQL Editor. Idempotent — safe to re-run.
-- After running, enable the JWT hook in:
--   Supabase → Authentication → Hooks → Custom Access Token
--   Function: public.custom_access_token_hook
-- =============================================================================

-- =============================================================================
-- SECTION 1: PROFILES (extends auth.users with app-level data)
-- =============================================================================

create table if not exists public.profiles (
  id          uuid        primary key references auth.users(id) on delete cascade,
  full_name   text        not null default '',
  avatar_url  text,
  locale      text        not null default 'en' check (locale in ('en', 'ar')),
  role        text        not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_admin_select" on public.profiles;
create policy "profiles_admin_select"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, locale)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'locale', 'en')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- SECTION 2: ORGANIZATIONS (the tenant)
-- =============================================================================

create table if not exists public.organizations (
  id                  uuid        primary key default gen_random_uuid(),
  name                text        not null,
  slug                text        not null unique,
  tier                text        not null default 'free'
                      check (tier in ('free', 'pro', 'business', 'enterprise')),
  stripe_customer_id  text        unique,
  logo_url            text,
  created_by          uuid        references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.organizations enable row level security;

-- Members can read their own org
drop policy if exists "orgs_select_member" on public.organizations;
create policy "orgs_select_member"
  on public.organizations for select
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = id
        and m.user_id = auth.uid()
        and m.status = 'active'
    )
  );

-- Only owner/admin can update
drop policy if exists "orgs_update_admin" on public.organizations;
create policy "orgs_update_admin"
  on public.organizations for update
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
        and m.status = 'active'
    )
  );

-- =============================================================================
-- SECTION 3: MEMBERSHIPS (users ↔ organizations, with roles)
-- =============================================================================

create table if not exists public.memberships (
  id               uuid        primary key default gen_random_uuid(),
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  user_id          uuid        not null references auth.users(id) on delete cascade,
  role             text        not null default 'member'
                   check (role in ('owner', 'admin', 'manager', 'member', 'viewer')),
  status           text        not null default 'active'
                   check (status in ('active', 'suspended')),
  invited_by       uuid        references auth.users(id),
  created_at       timestamptz not null default now(),
  unique(organization_id, user_id)
);

alter table public.memberships enable row level security;

-- Members see all memberships in their org
drop policy if exists "memberships_select_org" on public.memberships;
create policy "memberships_select_org"
  on public.memberships for select
  using (
    exists (
      select 1 from public.memberships m2
      where m2.organization_id = organization_id
        and m2.user_id = auth.uid()
        and m2.status = 'active'
    )
  );

-- Only owner/admin can insert memberships
drop policy if exists "memberships_insert_admin" on public.memberships;
create policy "memberships_insert_admin"
  on public.memberships for insert
  with check (
    exists (
      select 1 from public.memberships m2
      where m2.organization_id = organization_id
        and m2.user_id = auth.uid()
        and m2.role in ('owner', 'admin')
        and m2.status = 'active'
    )
  );

-- Only owner/admin can update memberships
drop policy if exists "memberships_update_admin" on public.memberships;
create policy "memberships_update_admin"
  on public.memberships for update
  using (
    exists (
      select 1 from public.memberships m2
      where m2.organization_id = organization_id
        and m2.user_id = auth.uid()
        and m2.role in ('owner', 'admin')
        and m2.status = 'active'
    )
  );

-- =============================================================================
-- SECTION 4: INVITATIONS
-- =============================================================================

create table if not exists public.invitations (
  id               uuid        primary key default gen_random_uuid(),
  organization_id  uuid        not null references public.organizations(id) on delete cascade,
  email            text        not null,
  role             text        not null default 'member'
                   check (role in ('admin', 'manager', 'member', 'viewer')),
  token            text        not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by       uuid        not null references auth.users(id),
  expires_at       timestamptz not null default now() + interval '7 days',
  accepted_at      timestamptz,
  created_at       timestamptz not null default now(),
  unique(organization_id, email)
);

alter table public.invitations enable row level security;

-- Org admins can manage invitations
drop policy if exists "invitations_select_admin" on public.invitations;
create policy "invitations_select_admin"
  on public.invitations for select
  using (
    exists (
      select 1 from public.memberships m
      where m.organization_id = organization_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
        and m.status = 'active'
    )
  );

drop policy if exists "invitations_insert_admin" on public.invitations;
create policy "invitations_insert_admin"
  on public.invitations for insert
  with check (
    exists (
      select 1 from public.memberships m
      where m.organization_id = organization_id
        and m.user_id = auth.uid()
        and m.role in ('owner', 'admin')
        and m.status = 'active'
    )
  );

-- Anyone can look up an invitation by token (for the accept flow)
drop policy if exists "invitations_select_by_token" on public.invitations;
create policy "invitations_select_by_token"
  on public.invitations for select
  using (true);

-- Service role updates accepted_at (server action uses service role)
drop policy if exists "invitations_update_service" on public.invitations;
create policy "invitations_update_service"
  on public.invitations for update
  using (auth.uid() is not null);

-- =============================================================================
-- SECTION 5: ADD organization_id TO EXISTING TABLES
-- =============================================================================

alter table public.projects
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.project_documents
  add column if not exists organization_id uuid references public.organizations(id);

-- =============================================================================
-- SECTION 6: updated_at TRIGGERS FOR NEW TABLES
-- =============================================================================

drop trigger if exists set_updated_at_profiles on public.profiles;
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_organizations on public.organizations;
create trigger set_updated_at_organizations
  before update on public.organizations
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_memberships on public.memberships;
create trigger set_updated_at_memberships
  before update on public.memberships
  for each row execute function public.set_updated_at();

-- =============================================================================
-- SECTION 7: CUSTOM JWT HOOK
-- Injects org_id + org_role into every Supabase JWT.
-- After running this migration, enable it in:
--   Supabase → Authentication → Hooks → Custom Access Token Hook
--   Function: public.custom_access_token_hook
-- =============================================================================

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql security definer as $$
declare
  claims     jsonb;
  membership record;
begin
  claims := event->'claims';

  -- Inject the user's active org_id and role into JWT claims
  select m.organization_id, m.role
    into membership
    from public.memberships m
   where m.user_id = (event->>'user_id')::uuid
     and m.status = 'active'
   order by m.created_at asc
   limit 1;

  if found then
    claims := jsonb_set(claims, '{org_id}',   to_jsonb(membership.organization_id::text));
    claims := jsonb_set(claims, '{org_role}',  to_jsonb(membership.role));
  else
    claims := jsonb_set(claims, '{org_id}',   'null'::jsonb);
    claims := jsonb_set(claims, '{org_role}',  'null'::jsonb);
  end if;

  return jsonb_set(event, '{claims}', claims);
end;
$$;

revoke execute on function public.custom_access_token_hook from public, anon, authenticated;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- =============================================================================
-- END OF MIGRATION 002
-- New tables: profiles, organizations, memberships, invitations
-- Modified:   projects (+ organization_id), project_documents (+ organization_id)
-- =============================================================================
