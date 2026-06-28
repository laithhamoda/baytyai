-- =============================================================================
-- BaytyAI — Supabase schema for auth roles + structured CMS
-- Run this in the Supabase SQL editor after creating your project.
-- =============================================================================

-- ---------- profiles: one row per auth user, carries the role ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- A user can read their own profile.
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

-- Auto-create a profile when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- site_content: the structured CMS key/value store ----------
create table if not exists public.site_content (
  key text primary key,
  value text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

-- Public site reads content (including anonymous visitors).
create policy "site_content_public_read"
  on public.site_content for select
  using (true);

-- Only admins can insert/update content.
create policy "site_content_admin_write"
  on public.site_content for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'));

-- ---------- storage: public 'media' bucket for uploads ----------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Anyone can read media (public site uses it).
create policy "media_public_read"
  on storage.objects for select
  using (bucket_id = 'media');

-- Only admins can upload/modify media.
create policy "media_admin_write"
  on storage.objects for insert
  with check (
    bucket_id = 'media'
    and exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
  );

-- =============================================================================
-- SEED YOUR ADMIN
-- 1. Sign in once via the site /login with YOUR email so the auth user + profile
--    are created.
-- 2. Then run (replace the email):
--      update public.profiles set role = 'admin' where email = 'you@baytyai.com';
-- 3. Reload /admin — you now have full access.
-- =============================================================================
