-- =============================================================================
-- Migration 007: platform admin = full access on every table
--
-- Adds a blanket "admin can do anything" RLS policy (FOR ALL: select/insert/
-- update/delete) to every application table, keyed to public.is_platform_admin().
-- This closes two gaps left by the per-action policies:
--   * no DELETE policy existed anywhere (RLS-on means nobody, even admin, could delete)
--   * admin could not edit other users' profiles
--
-- Idempotent: drops + recreates the policy. Applies only to tables that exist,
-- so it is safe on a partially-migrated database.
-- =============================================================================

do $$
declare
  t text;
  tables text[] := array[
    'profiles', 'organizations', 'memberships', 'invitations',
    'inquiries', 'quotations', 'approvals',
    'projects', 'project_documents', 'project_submissions',
    'identity_verifications', 'audit_log'
  ];
begin
  foreach t in array tables loop
    if exists (select 1 from pg_tables where schemaname = 'public' and tablename = t) then
      execute format('alter table public.%I enable row level security', t);
      execute format('drop policy if exists admin_full_access on public.%I', t);
      execute format(
        'create policy admin_full_access on public.%I for all '
        || 'using (public.is_platform_admin()) with check (public.is_platform_admin())',
        t
      );
    end if;
  end loop;
end $$;
