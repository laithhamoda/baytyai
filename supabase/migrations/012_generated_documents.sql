-- =============================================================================
-- Migration 012: AI-generated documents
--
-- Additive to the existing schema. Unlike project_documents (which stores
-- uploaded FILES), this table stores the structured BODY of documents drafted
-- by the AI document engine (RFIs, Engineer's Instructions, Material Submittals,
-- …). AI is the first drafter: rows start as 'draft' and are editable before a
-- human finalises them. RLS mirrors project_documents (owner + admin).
-- =============================================================================

create table if not exists public.generated_documents (
  id             uuid        primary key default gen_random_uuid(),
  project_id     uuid        not null references public.projects(id) on delete cascade,
  user_id        uuid        not null references auth.users(id),
  doc_type       text        not null,                    -- 'rfi','engineers_instruction','material_submittal'
  reference_no   text        not null,                    -- e.g. RFI-LK3F9A
  title          text        not null,
  language       text        not null default 'en'
                   check (language in ('en','ar')),
  status         text        not null default 'draft'
                   check (status in ('draft','final','archived')),
  fidic_clause   text,                                     -- '1.9','3.5','7.2' …
  body           jsonb       not null,                     -- { sections: [{heading, body}], meta: {} }
  ai_generated   boolean     not null default false,
  source         text        not null default 'template'  -- 'ai' | 'template'
                   check (source in ('ai','template')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

alter table public.generated_documents enable row level security;

drop policy if exists "gendocs_select_own" on public.generated_documents;
create policy "gendocs_select_own"
  on public.generated_documents for select
  using (auth.uid() = user_id);

drop policy if exists "gendocs_insert_own" on public.generated_documents;
create policy "gendocs_insert_own"
  on public.generated_documents for insert
  with check (auth.uid() = user_id);

drop policy if exists "gendocs_update_own" on public.generated_documents;
create policy "gendocs_update_own"
  on public.generated_documents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "gendocs_admin_all" on public.generated_documents;
create policy "gendocs_admin_all"
  on public.generated_documents for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'admin'
    )
  );

create index if not exists generated_documents_project_idx
  on public.generated_documents(project_id, created_at desc);
create index if not exists generated_documents_user_idx
  on public.generated_documents(user_id);

-- =============================================================================
-- DOWN (manual): drop table public.generated_documents;
-- =============================================================================
