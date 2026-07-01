-- =============================================================================
-- Migration 010: Security hardening (advisor remediation)
--
-- 1. Pin search_path on all remaining functions (prevents search_path injection).
-- 2. Revoke anon EXECUTE on SECURITY DEFINER helper functions (only needed by
--    authenticated flows / RLS evaluation).
-- 3. Revoke public/anon/authenticated EXECUTE on trigger + auth-hook functions —
--    they are invoked by the database/GoTrue as owner and must not be exposed
--    on /rest/v1/rpc.
-- Idempotent; skips any object that doesn't exist. Applied & verified live.
-- =============================================================================

-- 1. Pin search_path -----------------------------------------------------------
do $$
declare fn text;
  sigs text[] := array[
    'public.handle_new_user()','public.generate_reference_number()',
    'public.assign_reference_number()','public.set_updated_at()',
    'public.admin_email_allowlist()','public.custom_access_token_hook(jsonb)',
    'public.is_platform_admin()','public.current_org_id()','public.current_stakeholder_type()'
  ];
begin
  foreach fn in array sigs loop
    if to_regprocedure(fn) is not null then
      execute format('alter function %s set search_path = public, pg_catalog', fn);
    end if;
  end loop;
end $$;

-- 2. Revoke anon EXECUTE on SECURITY DEFINER helpers (keep authenticated: RLS) --
do $$
declare fn text;
  sigs text[] := array[
    'public.is_platform_admin()','public.current_org_id()','public.current_stakeholder_type()',
    'public.process_in_my_org(uuid)','public.is_org_verified(uuid)','public.current_org_verified()'
  ];
begin
  foreach fn in array sigs loop
    if to_regprocedure(fn) is not null then
      execute format('revoke execute on function %s from anon', fn);
    end if;
  end loop;
end $$;

-- 3. Lock down trigger + auth-hook functions (never called via the API) --------
do $$
declare fn text;
  sigs text[] := array[
    'public.handle_new_user()','public.generate_reference_number()',
    'public.assign_reference_number()','public.set_updated_at()',
    'public.custom_access_token_hook(jsonb)','public.enforce_criteria_lock()'
  ];
begin
  foreach fn in array sigs loop
    if to_regprocedure(fn) is not null then
      execute format('revoke execute on function %s from public, anon, authenticated', fn);
    end if;
  end loop;
end $$;

-- The verification-request RPC is called by signed-in org owners only.
revoke execute on function public.request_org_verification(text) from public, anon;

-- =============================================================================
-- Remaining advisor items are accepted by design / configured elsewhere:
--   • impersonation_audit_log RLS-no-policy — admin/service-role only (INFO).
--   • SECURITY DEFINER helpers callable by `authenticated` — required for RLS;
--     they only ever return the CALLER's own org/admin status (no cross-tenant
--     data), so this is low risk and left intact.
--   • auth_leaked_password_protection — enable in Auth settings (we use OTP).
--   • public_bucket_allows_listing (media) — review bucket policy separately.
-- =============================================================================
