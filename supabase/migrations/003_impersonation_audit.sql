-- Migration 003 — Impersonation audit log (Layer 4 of admin role-impersonation)
-- See docs/adr/0001-admin-role-impersonation.md
--
-- Records every impersonation attempt (granted / denied / error). Writes are
-- performed ONLY with the service-role key; RLS denies all access to anon and
-- authenticated roles so an impersonated session can neither read nor tamper
-- with the log.

create table if not exists public.impersonation_audit_log (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  requested_by  uuid,                    -- auth.users.id of the requester (nullable: denial may precede identification)
  requester_email text,                  -- email presented by the requesting session
  target_role   text not null,           -- the org role being impersonated
  source_ip     text,
  user_agent    text,
  result        text not null            -- 'granted' | 'denied' | 'error'
    check (result in ('granted', 'denied', 'error')),
  detail        text                      -- optional human-readable reason (e.g. which layer failed)
);

create index if not exists impersonation_audit_log_created_at_idx
  on public.impersonation_audit_log (created_at desc);

create index if not exists impersonation_audit_log_requested_by_idx
  on public.impersonation_audit_log (requested_by);

-- Lock the table down. Service-role bypasses RLS, so enabling RLS with NO
-- permissive policies means only service-role can read/write.
alter table public.impersonation_audit_log enable row level security;

-- Explicitly revoke from the API roles for defense in depth.
revoke all on public.impersonation_audit_log from anon, authenticated;
