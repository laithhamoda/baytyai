-- =============================================================================
-- Migration 008: Construction Consultant Selection module
--
-- Tables for the guided selection workflow: processes, versioned + weighted
-- criteria sets, consultants, evaluations/scores, clarifications, interviews,
-- award recommendations. RLS scopes everything to the owning organization (plus
-- platform admin). A trigger enforces that a LOCKED criteria set cannot change.
-- Additive; down-migration documented at the bottom.
-- =============================================================================

create table if not exists public.selection_processes (
  id               uuid primary key default gen_random_uuid(),
  organization_id  uuid not null references public.organizations(id) on delete cascade,
  created_by       uuid not null references auth.users(id),
  title            text not null,
  complexity       text not null default 'commercial' check (complexity in ('commercial','mega')),
  selection_method text check (selection_method in ('QBS','QCBS','LCS','FBS','SSS')),
  stage            text not null default 'intake',
  status           text not null default 'active' check (status in ('active','awarded','archived')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create table if not exists public.criteria_sets (
  id           uuid primary key default gen_random_uuid(),
  process_id   uuid not null references public.selection_processes(id) on delete cascade,
  version      integer not null default 1,
  status       text not null default 'draft' check (status in ('draft','approved','locked')),
  approved_by  uuid references auth.users(id),
  approved_at  timestamptz,
  created_at   timestamptz not null default now(),
  unique (process_id, version)
);

create table if not exists public.criteria (
  id              uuid primary key default gen_random_uuid(),
  criteria_set_id uuid not null references public.criteria_sets(id) on delete cascade,
  key             text not null,
  label           text not null,
  weight          numeric(5,2) not null check (weight >= 0 and weight <= 100),
  max_score       integer not null default 10 check (max_score > 0),
  dimension       text not null check (dimension in ('technical','financial')),
  guidance        text
);

create table if not exists public.consultants (
  id            uuid primary key default gen_random_uuid(),
  process_id    uuid not null references public.selection_processes(id) on delete cascade,
  name          text not null,
  prequalified  boolean not null default false,
  shortlisted   boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists public.evaluations (
  id                    uuid primary key default gen_random_uuid(),
  process_id            uuid not null references public.selection_processes(id) on delete cascade,
  consultant_id         uuid not null references public.consultants(id) on delete cascade,
  evaluator_id          uuid not null references auth.users(id),
  criteria_set_version  integer not null,
  submitted_at          timestamptz,
  created_at            timestamptz not null default now()
);

create table if not exists public.evaluation_scores (
  id             uuid primary key default gen_random_uuid(),
  evaluation_id  uuid not null references public.evaluations(id) on delete cascade,
  criterion_id   uuid not null references public.criteria(id) on delete cascade,
  raw            numeric(6,2) not null default 0,
  note           text
);

create table if not exists public.clarifications (
  id            uuid primary key default gen_random_uuid(),
  process_id    uuid not null references public.selection_processes(id) on delete cascade,
  consultant_id uuid references public.consultants(id) on delete cascade,
  question      text not null,
  answer        text,
  raised_by     uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

create table if not exists public.interviews (
  id            uuid primary key default gen_random_uuid(),
  process_id    uuid not null references public.selection_processes(id) on delete cascade,
  consultant_id uuid references public.consultants(id) on delete cascade,
  held_at       timestamptz,
  panel         text,
  notes         text,
  created_at    timestamptz not null default now()
);

create table if not exists public.award_recommendations (
  id                uuid primary key default gen_random_uuid(),
  process_id        uuid not null references public.selection_processes(id) on delete cascade,
  recommended_id    uuid references public.consultants(id),
  rationale         text,
  ranking_snapshot  jsonb not null default '[]',
  created_by        uuid references auth.users(id),
  created_at        timestamptz not null default now()
);

-- ---- Version lock: a LOCKED criteria set (and its criteria) is immutable ----
create or replace function public.enforce_criteria_lock() returns trigger
language plpgsql as $$
declare set_status text;
begin
  if tg_table_name = 'criteria_sets' then
    if old.status = 'locked' and new.status = 'locked' then
      raise exception 'Criteria set is locked and cannot be modified (create a new version)';
    end if;
    return new;
  else
    select status into set_status from public.criteria_sets
      where id = coalesce(new.criteria_set_id, old.criteria_set_id);
    if set_status = 'locked' then
      raise exception 'Criteria belong to a locked set and cannot be changed';
    end if;
    return coalesce(new, old);
  end if;
end $$;

drop trigger if exists trg_lock_criteria_sets on public.criteria_sets;
create trigger trg_lock_criteria_sets before update on public.criteria_sets
  for each row execute function public.enforce_criteria_lock();

drop trigger if exists trg_lock_criteria on public.criteria;
create trigger trg_lock_criteria before insert or update or delete on public.criteria
  for each row execute function public.enforce_criteria_lock();

-- ---- RLS: scope every table to the owning org (+ platform admin) ----
do $$
declare t text;
  tables text[] := array[
    'selection_processes','criteria_sets','criteria','consultants',
    'evaluations','evaluation_scores','clarifications','interviews','award_recommendations'
  ];
begin
  foreach t in array tables loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists admin_full_access on public.%I', t);
    execute format('create policy admin_full_access on public.%I for all using (public.is_platform_admin()) with check (public.is_platform_admin())', t);
  end loop;
end $$;

-- Org-scoped access for the root process table.
drop policy if exists sp_org on public.selection_processes;
create policy sp_org on public.selection_processes for all
  using (organization_id = public.current_org_id())
  with check (organization_id = public.current_org_id());

-- Child tables inherit access via their process's org.
create or replace function public.process_in_my_org(pid uuid) returns boolean
language sql stable security definer as $$
  select exists (
    select 1 from public.selection_processes sp
    where sp.id = pid and sp.organization_id = public.current_org_id()
  );
$$;

do $$
declare t text;
  child_tables text[] := array['criteria_sets','consultants','evaluations','clarifications','interviews','award_recommendations'];
begin
  foreach t in array child_tables loop
    execute format('drop policy if exists child_org on public.%I', t);
    execute format('create policy child_org on public.%I for all using (public.process_in_my_org(process_id)) with check (public.process_in_my_org(process_id))', t);
  end loop;
end $$;

create index if not exists sp_org_idx on public.selection_processes(organization_id);
create index if not exists criteria_set_idx on public.criteria(criteria_set_id);
create index if not exists eval_process_idx on public.evaluations(process_id);

-- =============================================================================
-- DOWN (manual): drop the 9 tables, the two functions, and the triggers.
-- =============================================================================
