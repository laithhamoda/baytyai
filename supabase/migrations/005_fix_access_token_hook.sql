-- =============================================================================
-- Migration 005: Fix the custom access token hook (login was returning 500)
--
-- Root cause: the auth Custom Access Token Hook (public.custom_access_token_hook)
-- queried public.memberships, a table that does not exist in this database.
-- GoTrue runs the hook on every token mint, so EVERY login/verify returned 500
-- ("Error running hook ... relation public.memberships does not exist"), which
-- the app surfaced as "code invalid or expired".
--
-- Fix: redefine the hook so it injects the profile role claim when available and
-- never fails — it tolerates missing tables and returns the event unchanged on
-- any error. Safe whether or not the tenancy tables exist.
-- =============================================================================

create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims    jsonb := coalesce(event->'claims', '{}'::jsonb);
  uid       uuid;
  user_role text;
begin
  begin
    uid := (event->>'user_id')::uuid;

    -- Add the app role from profiles, if the table/row exists.
    select role into user_role from public.profiles where id = uid;
    if user_role is not null then
      claims := jsonb_set(claims, '{app_role}', to_jsonb(user_role));
    end if;

    event := jsonb_set(event, '{claims}', claims);
  exception
    when others then
      -- Never block login: on any error, pass the event through untouched.
      return event;
  end;

  return event;
end;
$$;

-- GoTrue executes the hook as supabase_auth_admin.
grant execute on function public.custom_access_token_hook(jsonb) to supabase_auth_admin;
