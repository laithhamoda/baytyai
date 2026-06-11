-- =============================================================================
-- BaytyAI — Project Intake Schema (Migration 001)
-- Run in Supabase SQL Editor on a fresh blank query tab.
-- Safe to re-run: all statements use IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- =============================================================================

-- =============================================================================
-- SECTION 1: IDENTITY VERIFICATION (KYC gate for /dashboard access)
-- =============================================================================

create table if not exists public.identity_verifications (
  id               uuid        primary key default gen_random_uuid(),
  user_id          uuid        not null references auth.users(id) on delete cascade,
  full_name        text        not null default '',
  email            text        not null default '',
  phone            text        not null default '',
  nationality      text        not null default '',
  id_front_path    text,
  id_back_path     text,
  selfie_path      text,
  status           text        not null default 'incomplete'
                   check (status in (
                     'incomplete',
                     'pending_review',
                     'approved',
                     'rejected',
                     'resubmit_requested'
                   )),
  rejection_reason text,
  reviewed_by      uuid        references auth.users(id),
  reviewed_at      timestamptz,
  submitted_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint identity_verifications_user_unique unique (user_id)
);

alter table public.identity_verifications enable row level security;

drop policy if exists "iv_select_own" on public.identity_verifications;
create policy "iv_select_own"
  on public.identity_verifications for select
  using (auth.uid() = user_id);

drop policy if exists "iv_insert_own" on public.identity_verifications;
create policy "iv_insert_own"
  on public.identity_verifications for insert
  with check (auth.uid() = user_id);

drop policy if exists "iv_update_own" on public.identity_verifications;
create policy "iv_update_own"
  on public.identity_verifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "iv_admin_all" on public.identity_verifications;
create policy "iv_admin_all"
  on public.identity_verifications for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 2: PROJECTS
-- Stores the full wizard draft as JSONB columns per step, plus lifecycle state.
-- =============================================================================

create table if not exists public.projects (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  -- Step data stored as JSONB — validated in application layer
  org_data        jsonb,
  project_data    jsonb,
  scope_data      jsonb,
  docs_data       jsonb,
  -- Wizard progress
  current_step    integer     not null default 1,
  -- Lifecycle
  status          text        not null default 'draft'
                  check (status in (
                    'draft','submitted','under_review',
                    'information_requested','approved','active','archived'
                  )),
  reference_number text       unique,
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.projects enable row level security;

drop policy if exists "projects_select_own" on public.projects;
create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = user_id);

drop policy if exists "projects_insert_own" on public.projects;
create policy "projects_insert_own"
  on public.projects for insert
  with check (auth.uid() = user_id);

drop policy if exists "projects_update_own_draft" on public.projects;
create policy "projects_update_own_draft"
  on public.projects for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "projects_admin_all" on public.projects;
create policy "projects_admin_all"
  on public.projects for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 3: PROJECT DOCUMENTS (Step 4 — file uploads)
-- =============================================================================

create table if not exists public.project_documents (
  id              uuid        primary key default gen_random_uuid(),
  project_id      uuid        not null references public.projects(id) on delete cascade,
  user_id         uuid        not null references auth.users(id),
  document_type   text        not null,
  file_name       text        not null,
  storage_path    text        not null,
  file_size_bytes integer     not null,
  mime_type       text        not null,
  created_at      timestamptz not null default now()
);

alter table public.project_documents enable row level security;

drop policy if exists "docs_select_own" on public.project_documents;
create policy "docs_select_own"
  on public.project_documents for select
  using (auth.uid() = user_id);

drop policy if exists "docs_insert_own" on public.project_documents;
create policy "docs_insert_own"
  on public.project_documents for insert
  with check (auth.uid() = user_id);

drop policy if exists "docs_delete_own" on public.project_documents;
create policy "docs_delete_own"
  on public.project_documents for delete
  using (auth.uid() = user_id);

drop policy if exists "docs_admin_all" on public.project_documents;
create policy "docs_admin_all"
  on public.project_documents for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 4: PROJECT SUBMISSIONS (immutable record at time of submit)
-- =============================================================================

create table if not exists public.project_submissions (
  id           uuid        primary key default gen_random_uuid(),
  project_id   uuid        not null references public.projects(id),
  user_id      uuid        not null references auth.users(id),
  submitted_at timestamptz not null default now()
);

alter table public.project_submissions enable row level security;

drop policy if exists "submissions_select_own" on public.project_submissions;
create policy "submissions_select_own"
  on public.project_submissions for select
  using (auth.uid() = user_id);

drop policy if exists "submissions_insert_own" on public.project_submissions;
create policy "submissions_insert_own"
  on public.project_submissions for insert
  with check (auth.uid() = user_id);

drop policy if exists "submissions_admin_all" on public.project_submissions;
create policy "submissions_admin_all"
  on public.project_submissions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 5: AUDIT LOG (append-only — no UPDATE/DELETE policies)
-- =============================================================================

create table if not exists public.audit_log (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id),
  action      text        not null,
  entity_type text        not null,
  entity_id   text        not null,
  metadata    jsonb       not null default '{}',
  created_at  timestamptz not null default now()
);

alter table public.audit_log enable row level security;

drop policy if exists "audit_admin_select" on public.audit_log;
create policy "audit_admin_select"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

drop policy if exists "audit_insert_authenticated" on public.audit_log;
create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (auth.uid() is not null);

-- NO UPDATE or DELETE policies — intentionally append-only.

-- =============================================================================
-- SECTION 6: PRIVATE STORAGE BUCKETS
-- =============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  26214400,
  array['application/pdf','image/jpeg','image/jpg','image/png','image/webp']
)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'identity-documents',
  'identity-documents',
  false,
  10485760,
  array['image/jpeg','image/jpg','image/png','image/webp','image/heic']
)
on conflict (id) do nothing;

-- project-documents RLS
drop policy if exists "proj_docs_insert_own" on storage.objects;
create policy "proj_docs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "proj_docs_select_own" on storage.objects;
create policy "proj_docs_select_own"
  on storage.objects for select
  using (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "proj_docs_delete_own" on storage.objects;
create policy "proj_docs_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "proj_docs_admin" on storage.objects;
create policy "proj_docs_admin"
  on storage.objects for all
  using (
    bucket_id = 'project-documents'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- identity-documents RLS
drop policy if exists "id_docs_insert_own" on storage.objects;
create policy "id_docs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'identity-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "id_docs_select_own" on storage.objects;
create policy "id_docs_select_own"
  on storage.objects for select
  using (
    bucket_id = 'identity-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "id_docs_admin" on storage.objects;
create policy "id_docs_admin"
  on storage.objects for all
  using (
    bucket_id = 'identity-documents'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 7: REFERENCE NUMBER GENERATOR
-- Format: BAYTY-YYYY-XXXXXX  (called by submit-project server action)
-- =============================================================================

create or replace function public.generate_reference_number()
returns text
language plpgsql
security definer
as $$
declare
  ref       text;
  year_part text;
  rand_part text;
begin
  year_part := to_char(now(), 'YYYY');
  loop
    rand_part := upper(substring(md5(random()::text) from 1 for 6));
    ref := 'BAYTY-' || year_part || '-' || rand_part;
    exit when not exists (
      select 1 from public.projects where reference_number = ref
    );
  end loop;
  return ref;
end;
$$;

-- Auto-assign reference number when a project is submitted
create or replace function public.assign_reference_number()
returns trigger
language plpgsql
security definer
as $$
begin
  if new.status = 'submitted' and old.status = 'draft' and new.reference_number is null then
    new.reference_number := public.generate_reference_number();
    new.submitted_at := now();
  end if;
  return new;
end;
$$;

drop trigger if exists assign_reference_number_trigger on public.projects;
create trigger assign_reference_number_trigger
  before update on public.projects
  for each row execute function public.assign_reference_number();

-- =============================================================================
-- SECTION 8: updated_at triggers
-- =============================================================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_updated_at_projects on public.projects;
create trigger set_updated_at_projects
  before update on public.projects
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_identity_verifications on public.identity_verifications;
create trigger set_updated_at_identity_verifications
  before update on public.identity_verifications
  for each row execute function public.set_updated_at();

-- =============================================================================
-- END OF MIGRATION 001
-- Verify with:
--   select table_name from information_schema.tables
--   where table_schema = 'public' order by table_name;
-- Expected new tables: audit_log, identity_verifications, project_documents,
--   project_submissions, projects
-- =============================================================================
