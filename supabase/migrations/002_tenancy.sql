-- ============================================================
-- 002_tenancy.sql
-- Week 1 tenancy foundation: profiles, organizations,
-- memberships, invitations + JWT hook + project columns
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ─── profiles ───────────────────────────────────────────────
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  avatar_url  text,
  locale      text not null default 'en' check (locale in ('en', 'ar')),
  role        text not null default 'user' check (role in ('user', 'admin')),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can read their own profile
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'profiles_select_own'
  ) then
    create policy profiles_select_own on public.profiles
      for select using (auth.uid() = id);
  end if;
end $$;

-- Users can update their own profile
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'profiles_update_own'
  ) then
    create policy profiles_update_own on public.profiles
      for update using (auth.uid() = id);
  end if;
end $$;

-- Admins can select all profiles
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'profiles'
      and policyname = 'profiles_select_admin'
  ) then
    create policy profiles_select_admin on public.profiles
      for select using (
        exists (
          select 1 from public.profiles p2
          where p2.id = auth.uid() and p2.role = 'admin'
        )
      );
  end if;
end $$;

-- Trigger: auto-insert profile on auth.users insert
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

-- ─── organizations ───────────────────────────────────────────
create table if not exists public.organizations (
  id                  uuid primary key default gen_random_uuid(),
  name                text not null,
  slug                text not null unique,
  tier                text not null default 'free' check (tier in ('free','pro','business','enterprise')),
  stripe_customer_id  text unique,
  logo_url            text,
  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.organizations enable row level security;

-- Members of the org can SELECT
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organizations'
      and policyname = 'organizations_select_members'
  ) then
    create policy organizations_select_members on public.organizations
      for select using (
        exists (
          select 1 from public.memberships m
          where m.organization_id = id
            and m.user_id = auth.uid()
            and m.status = 'active'
        )
      );
  end if;
end $$;

-- Only owner/admin members can UPDATE
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'organizations'
      and policyname = 'organizations_update_admin'
  ) then
    create policy organizations_update_admin on public.organizations
      for update using (
        exists (
          select 1 from public.memberships m
          where m.organization_id = id
            and m.user_id = auth.uid()
            and m.status = 'active'
            and m.role in ('owner', 'admin')
        )
      );
  end if;
end $$;

-- ─── memberships ─────────────────────────────────────────────
create table if not exists public.memberships (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  user_id          uuid not null references auth.users(id) on delete cascade,
  role             text not null default 'member' check (role in ('owner','admin','manager','member','viewer')),
  status           text not null default 'active' check (status in ('active','suspended')),
  invited_by       uuid references auth.users(id),
  created_at       timestamptz not null default now(),
  unique(organization_id, user_id)
);

alter table public.memberships enable row level security;

-- Users can SELECT memberships in orgs they belong to
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships'
      and policyname = 'memberships_select_org_members'
  ) then
    create policy memberships_select_org_members on public.memberships
      for select using (
        exists (
          select 1 from public.memberships m2
          where m2.organization_id = organization_id
            and m2.user_id = auth.uid()
            and m2.status = 'active'
        )
      );
  end if;
end $$;

-- Only owner/admin can INSERT memberships
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships'
      and policyname = 'memberships_insert_admin'
  ) then
    create policy memberships_insert_admin on public.memberships
      for insert with check (
        exists (
          select 1 from public.memberships m2
          where m2.organization_id = organization_id
            and m2.user_id = auth.uid()
            and m2.status = 'active'
            and m2.role in ('owner', 'admin')
        )
      );
  end if;
end $$;

-- Only owner/admin can UPDATE memberships
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships'
      and policyname = 'memberships_update_admin'
  ) then
    create policy memberships_update_admin on public.memberships
      for update using (
        exists (
          select 1 from public.memberships m2
          where m2.organization_id = organization_id
            and m2.user_id = auth.uid()
            and m2.status = 'active'
            and m2.role in ('owner', 'admin')
        )
      );
  end if;
end $$;

-- Only owner/admin can DELETE memberships
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'memberships'
      and policyname = 'memberships_delete_admin'
  ) then
    create policy memberships_delete_admin on public.memberships
      for delete using (
        exists (
          select 1 from public.memberships m2
          where m2.organization_id = organization_id
            and m2.user_id = auth.uid()
            and m2.status = 'active'
            and m2.role in ('owner', 'admin')
        )
      );
  end if;
end $$;

-- ─── invitations ─────────────────────────────────────────────
create table if not exists public.invitations (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  email            text not null,
  role             text not null default 'member' check (role in ('admin','manager','member','viewer')),
  token            text not null unique default encode(gen_random_bytes(32), 'hex'),
  invited_by       uuid not null references auth.users(id),
  expires_at       timestamptz not null default now() + interval '7 days',
  accepted_at      timestamptz,
  created_at       timestamptz not null default now(),
  unique(organization_id, email)
);

alter table public.invitations enable row level security;

-- Org admins/owners can manage invitations
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invitations'
      and policyname = 'invitations_manage_admin'
  ) then
    create policy invitations_manage_admin on public.invitations
      using (
        exists (
          select 1 from public.memberships m
          where m.organization_id = organization_id
            and m.user_id = auth.uid()
            and m.status = 'active'
            and m.role in ('owner', 'admin')
        )
      );
  end if;
end $$;

-- Anyone can SELECT by token (for accept flow)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'invitations'
      and policyname = 'invitations_select_by_token'
  ) then
    create policy invitations_select_by_token on public.invitations
      for select using (true);
  end if;
end $$;

-- ─── Add organization_id to projects and project_documents ───
alter table public.projects
  add column if not exists organization_id uuid references public.organizations(id);

alter table public.project_documents
  add column if not exists organization_id uuid references public.organizations(id);

-- ─── updated_at triggers ─────────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists organizations_updated_at on public.organizations;
create trigger organizations_updated_at
  before update on public.organizations
  for each row execute function public.set_updated_at();

-- ─── Custom JWT claim hook ────────────────────────────────────
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb language plpgsql security definer as $$
declare
  claims jsonb;
  membership record;
begin
  claims := event->'claims';
  select organization_id, role into membership
    from public.memberships
    where user_id = (event->>'user_id')::uuid
      and status = 'active'
    order by created_at asc limit 1;
  if found then
    claims := jsonb_set(claims, '{org_id}', to_jsonb(membership.organization_id::text));
    claims := jsonb_set(claims, '{org_role}', to_jsonb(membership.role));
  end if;
  return jsonb_set(event, '{claims}', claims);
end;
$$;

grant execute on function public.custom_access_token_hook to supabase_auth_admin;

-- ============================================================
-- Verification: new tables created by this migration:
--   public.profiles
--   public.organizations
--   public.memberships
--   public.invitations
-- ============================================================
