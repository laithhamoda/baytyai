-- =============================================================================
-- BaytyAI — Project Intake Schema (Migration 001)
-- Run this in the Supabase SQL editor AFTER schema.sql has been executed.
-- Safe to re-run: all statements use IF NOT EXISTS / ON CONFLICT DO NOTHING.
-- =============================================================================

-- =============================================================================
-- SECTION 1: IDENTITY VERIFICATION (KYC gate for /dashboard access)
-- =============================================================================

create table if not exists public.identity_verifications (
  id              uuid        primary key default gen_random_uuid(),
  user_id         uuid        not null references auth.users(id) on delete cascade,
  email           text        not null,
  phone           text        not null default '',
  id_front_path   text,
  id_back_path    text,
  selfie_path     text,
  status          text        not null default 'incomplete'
                              check (status in (
                                'incomplete',
                                'pending_review',
                                'approved',
                                'rejected',
                                'resubmit_requested'
                              )),
  rejection_reason text,
  reviewed_by     uuid        references auth.users(id),
  reviewed_at     timestamptz,
  submitted_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  constraint identity_verifications_user_unique unique (user_id)
);

alter table public.identity_verifications enable row level security;

-- User can read and update their own verification record.
create policy "iv_select_own"
  on public.identity_verifications for select
  using (auth.uid() = user_id);

create policy "iv_insert_own"
  on public.identity_verifications for insert
  with check (auth.uid() = user_id);

create policy "iv_update_own"
  on public.identity_verifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Admins can read and update all verification records.
create policy "iv_admin_all"
  on public.identity_verifications for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 2: ORGANIZATIONS (Step 1 of the project wizard)
-- =============================================================================

create table if not exists public.organizations (
  id                      uuid        primary key default gen_random_uuid(),
  created_by              uuid        not null references auth.users(id),
  -- Legal identity
  name_en                 text        not null default '',
  name_ar                 text        not null default '',
  commercial_registration text        not null default '',
  vat_number              text,
  country                 text        not null default '',
  city                    text        not null default '',
  entity_type             text        not null default ''
                          check (entity_type in (
                            'government',
                            'semi_government',
                            'pif_portfolio',
                            'private_sector',
                            'fm_operator',
                            'tier1_contractor',
                            'tier2_contractor',
                            'consultant',
                            'other',
                            ''
                          )),
  -- Primary point of contact
  poc_name                text        not null default '',
  poc_role                text        not null default '',
  poc_email               text        not null default '',
  poc_phone               text        not null default '',
  -- Authorized signatory
  signatory_name          text        not null default '',
  signatory_role          text        not null default '',
  signatory_email         text        not null default '',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

alter table public.organizations enable row level security;

create policy "org_select_own"
  on public.organizations for select
  using (auth.uid() = created_by);

create policy "org_insert_own"
  on public.organizations for insert
  with check (auth.uid() = created_by);

create policy "org_update_own"
  on public.organizations for update
  using (auth.uid() = created_by)
  with check (auth.uid() = created_by);

create policy "org_admin_all"
  on public.organizations for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 3: PROJECTS (Steps 2–3 of the wizard + status lifecycle)
-- =============================================================================

create table if not exists public.projects (
  id                  uuid        primary key default gen_random_uuid(),
  created_by          uuid        not null references auth.users(id),
  organization_id     uuid        references public.organizations(id),

  -- Step 2: Project Profile
  name_en             text        not null default '',
  name_ar             text        not null default '',
  project_type        text        not null default ''
                      check (project_type in (
                        'mega_project','giga_development','smart_city','mixed_use',
                        'infrastructure','transport','healthcare','education',
                        'industrial','residential','hospitality','cultural',
                        'defense','fm_only',''
                      )),
  asset_class         text        not null default ''
                      check (asset_class in (
                        'vertical','horizontal','linear_infrastructure','mixed',''
                      )),
  project_phase       text        not null default ''
                      check (project_phase in (
                        'concept','feasibility','design','tender',
                        'construction','handover','operations_fm',''
                      )),
  country             text        not null default '',
  city                text        not null default '',
  gps_coordinates     text,
  masterplan_zone     text,
  gfa_sqm             numeric,
  site_area_sqm       numeric,
  num_buildings       integer,
  capex_band          text        not null default ''
                      check (capex_band in (
                        'under_50m','50m_250m','250m_1b','1b_5b','5b_plus',''
                      )),
  estimated_start     date,
  estimated_completion date,
  funding_source      text        not null default ''
                      check (funding_source in (
                        'government_budget','sovereign_wealth_fund','private_equity',
                        'bank_financing','ppp','other',''
                      )),
  primary_regulator   text,

  -- Step 3: Engagement Scope
  service_modules     text[]      not null default '{}',
  expected_users      text,
  expected_doc_volume text,
  integrations        text[]      not null default '{}',
  data_residency      text
                      check (data_residency in (
                        'ksa','uae','qatar','jordan','eu','no_preference', null
                      )),
  language_support    text[]      not null default '{}',
  target_go_live      date,

  -- Lifecycle
  status              text        not null default 'draft'
                      check (status in (
                        'draft','submitted','under_review',
                        'information_requested','approved','active','archived'
                      )),
  reference_number    text        unique,
  wizard_step         integer     not null default 1,
  submitted_at        timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

alter table public.projects enable row level security;

create policy "projects_select_own"
  on public.projects for select
  using (auth.uid() = created_by);

create policy "projects_insert_own"
  on public.projects for insert
  with check (auth.uid() = created_by);

create policy "projects_update_own_draft"
  on public.projects for update
  using (auth.uid() = created_by and status = 'draft')
  with check (auth.uid() = created_by);

create policy "projects_admin_all"
  on public.projects for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 4: PROJECT DOCUMENTS (Step 4 — file uploads)
-- =============================================================================

create table if not exists public.project_documents (
  id              uuid        primary key default gen_random_uuid(),
  project_id      uuid        not null references public.projects(id) on delete cascade,
  uploaded_by     uuid        not null references auth.users(id),
  document_type   text        not null
                  check (document_type in (
                    'cr_certificate',
                    'vat_certificate',
                    'signatory_id',
                    'project_noc',
                    'confidentiality_ack',
                    'masterplan',
                    'boq',
                    'tender_docs',
                    'rfp',
                    'org_chart',
                    'other'
                  )),
  is_required     boolean     not null default false,
  file_name       text        not null,
  file_path       text        not null,
  file_size_bytes integer     not null,
  mime_type       text        not null,
  created_at      timestamptz not null default now()
);

alter table public.project_documents enable row level security;

create policy "docs_select_own"
  on public.project_documents for select
  using (auth.uid() = uploaded_by);

create policy "docs_insert_own"
  on public.project_documents for insert
  with check (auth.uid() = uploaded_by);

create policy "docs_delete_own_draft"
  on public.project_documents for delete
  using (
    auth.uid() = uploaded_by
    and exists (
      select 1 from public.projects pr
      where pr.id = project_id and pr.status = 'draft'
    )
  );

create policy "docs_admin_all"
  on public.project_documents for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 5: PROJECT SUBMISSIONS (immutable record at time of submit)
-- =============================================================================

create table if not exists public.project_submissions (
  id               uuid        primary key default gen_random_uuid(),
  project_id       uuid        not null references public.projects(id),
  submitted_by     uuid        not null references auth.users(id),
  reference_number text        not null unique,
  snapshot         jsonb       not null,
  terms_accepted   boolean     not null default false,
  pdpl_consent     boolean     not null default false,
  submitted_at     timestamptz not null default now()
);

alter table public.project_submissions enable row level security;

-- Users can read their own submissions (for confirmation/receipt).
create policy "submissions_select_own"
  on public.project_submissions for select
  using (auth.uid() = submitted_by);

-- INSERT only — no UPDATE or DELETE.
create policy "submissions_insert_own"
  on public.project_submissions for insert
  with check (auth.uid() = submitted_by);

create policy "submissions_admin_all"
  on public.project_submissions for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- =============================================================================
-- SECTION 6: AUDIT LOG (append-only, no UPDATE/DELETE policies)
-- =============================================================================

create table if not exists public.audit_log (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        references auth.users(id),
  action        text        not null,
  resource_type text        not null,
  resource_id   uuid,
  metadata      jsonb,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now()
);

alter table public.audit_log enable row level security;

-- Admins can read the full log.
create policy "audit_admin_select"
  on public.audit_log for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Anyone authenticated can insert (server actions use service role anyway).
create policy "audit_insert_authenticated"
  on public.audit_log for insert
  with check (auth.uid() is not null);

-- NO UPDATE or DELETE policies on audit_log — it is intentionally append-only.

-- =============================================================================
-- SECTION 7: PRIVATE STORAGE BUCKETS
-- =============================================================================

-- Private bucket for project intake documents (Step 4 uploads).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-documents',
  'project-documents',
  false,
  26214400, -- 25 MB in bytes
  array[
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
on conflict (id) do nothing;

-- Private bucket for identity verification photos (KYC).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'identity-documents',
  'identity-documents',
  false,
  10485760, -- 10 MB in bytes
  array[
    'image/jpeg',
    'image/jpg',
    'image/png'
  ]
)
on conflict (id) do nothing;

-- project-documents: owner can upload/read their own files.
create policy "proj_docs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "proj_docs_select_own"
  on storage.objects for select
  using (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "proj_docs_delete_own"
  on storage.objects for delete
  using (
    bucket_id = 'project-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "proj_docs_admin"
  on storage.objects for all
  using (
    bucket_id = 'project-documents'
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- identity-documents: owner can upload/read their own files.
create policy "id_docs_insert_own"
  on storage.objects for insert
  with check (
    bucket_id = 'identity-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "id_docs_select_own"
  on storage.objects for select
  using (
    bucket_id = 'identity-documents'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

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
-- SECTION 8: HELPER FUNCTION — reference number generator
-- Format: BAYTY-{YYYY}-{6-char alphanumeric uppercase}
-- Called from the server-side submission action.
-- =============================================================================

create or replace function public.generate_reference_number()
returns text
language plpgsql
security definer
as $$
declare
  ref text;
  year_part text;
  rand_part text;
begin
  year_part := to_char(now(), 'YYYY');
  loop
    rand_part := upper(substring(md5(random()::text) from 1 for 6));
    ref := 'BAYTY-' || year_part || '-' || rand_part;
    exit when not exists (
      select 1 from public.project_submissions
      where reference_number = ref
    );
  end loop;
  return ref;
end;
$$;

-- =============================================================================
-- SECTION 9: updated_at auto-maintenance
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

drop trigger if exists set_updated_at_organizations on public.organizations;
create trigger set_updated_at_organizations
  before update on public.organizations
  for each row execute function public.set_updated_at();

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
-- To verify: run the following query and confirm 6 tables are listed:
--   select table_name from information_schema.tables
--   where table_schema = 'public'
--   order by table_name;
-- Expected new tables: audit_log, identity_verifications, organizations,
--   project_documents, project_submissions, projects
-- =============================================================================
