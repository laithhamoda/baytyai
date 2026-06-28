-- =============================================================================
-- Migration 004: Admin bootstrap
--
-- Grants application admin (profiles.role = 'admin') to a fixed allowlist of
-- founder emails, in a reproducible, version-controlled way:
--
--   1. A SECURITY DEFINER helper that returns the admin email allowlist.
--   2. handle_new_user() is extended so a newly-signed-up user whose email is
--      on the allowlist is created as 'admin' immediately (no manual step).
--   3. A one-time backfill promotes any EXISTING matching account to 'admin',
--      so access is granted even if the founder already signed up.
--
-- To add/remove an admin: edit the array in public.admin_email_allowlist(),
-- ship a new migration, done. Admin is NEVER assignable from the client —
-- profiles RLS only allows users to update their OWN row, and role changes
-- to 'admin' are not part of any client write path.
-- =============================================================================

-- 1. Allowlist of founder/admin emails (lower-cased).
create or replace function public.admin_email_allowlist()
returns text[]
language sql
immutable
as $$
  select array[
    'info@baytyai.com',
    'laithrhamoda@gmail.com'
  ]::text[];
$$;

-- 2. Re-create the signup trigger so allowlisted emails become admin on insert.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, full_name, locale, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'locale', 'en'),
    case
      when lower(new.email) = any (public.admin_email_allowlist()) then 'admin'
      else 'user'
    end
  )
  on conflict (id) do update
    set role = case
      when lower(new.email) = any (public.admin_email_allowlist()) then 'admin'
      else public.profiles.role
    end;
  return new;
end;
$$;

-- (trigger on_auth_user_created already exists from migration 002 and points at
--  handle_new_user; replacing the function body is sufficient.)

-- 3. Backfill: promote any existing user whose email is on the allowlist.
update public.profiles p
set role = 'admin', updated_at = now()
from auth.users u
where u.id = p.id
  and lower(u.email) = any (public.admin_email_allowlist())
  and p.role <> 'admin';
