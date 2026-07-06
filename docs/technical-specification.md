# BaytyAI — Investment-Grade Technical Specification

**Version 1.0 · UAE-registered AI construction-management SaaS + verified professional marketplace**
Audience: Series A CTO, technical due-diligence, founding engineering team (Claude Pro, one-feature-per-session).
Currency peg: **US$1 = AED 3.6725** (CBUAE). FIDIC references: **2017 (2nd) edition**. Regulatory basis: UAE Federal Decree-Law **No. 45/2021** (PDPL), TDRA, Dubai Municipality, Abu Dhabi TAMM, RERA, KSA MOMAH / Royal Decree M/19.

---

## Table of Contents
1. Complete Database Schema
2. RBAC Permission Matrix
3. AI Document Generation Engine
4. Project Lifecycle Workflow
5. Marketplace & Inquiry System
6. Authentication & Onboarding
7. Notification & Communication System
8. Subscription & Pricing Architecture
9. Security & Compliance Architecture
10. Arabic Language & RTL Architecture
11. Year 1 Build Sequence

---

## Architecture Principles (read first)

- **Two-axis authorization.** Every actor is `(party_type, role_level)` on a given `project`. Party type governs *what data domain* they can touch; role level governs *what authority* they hold. RLS enforces the first axis; a `has_authority()` SQL function enforces the second.
- **JWT is the single source of scope.** Supabase Auth issues a JWT with custom claims: `organisation_id`, `party_type`, `role_level`, and `project_access` (array of project IDs the user is engaged on). RLS reads these via `auth.jwt()`; no app-layer trust.
- **Documents are append-only.** No row in `documents` is ever mutated in place after issue; edits create a `document_revisions` row. Deletes are soft (`archived_at`).
- **AI is a first drafter, never an authority.** Claude generates a draft record with `status = 'draft'`; a human with signing authority must sign before a document is valid.
- **Money is integer fils.** All monetary columns are `bigint` in **fils** (1 AED = 100 fils) to avoid float error; display layer divides by 100 and formats per locale.

---

## SECTION 1 — Complete Database Schema

### 1.1 Enums

```sql
create type party_type       as enum ('client','consultant','contractor','subcontractor','supplier');
create type role_level        as enum ('ceo','commercial_director','project_manager','site_inspector','finance_director');
create type verification_state as enum ('pending','verified','rejected','suspended','expired');
create type credential_type   as enum ('emirates_id','iqama','passport','trade_license','establishment_card',
                                       'rera_registration','momah_registration','trademark_certificate','employment_contract');
create type project_phase     as enum ('inception','design','tender','construction','practical_completion','dlp','final_account','archived');
create type doc_status        as enum ('draft','submitted','under_review','approved','rejected','signed','superseded','archived');
create type approval_action   as enum ('approve','reject','comment','request_info','countersign');
create type fidic_book        as enum ('red','yellow','silver','green');
create type inquiry_state     as enum ('open','clarification','closed','awarded','cancelled');
create type payment_state     as enum ('drafted','submitted','certified','part_certified','rejected','paid');
create type variation_state   as enum ('instructed','requested','quoted','agreed','rejected','final_accounted');
create type subscription_tier as enum ('starter','professional','enterprise','corporate');
```

### 1.2 Identity & Organisation

```sql
create table organisations (
  id                uuid primary key default gen_random_uuid(),
  party_type        party_type not null,                       -- fixed at creation; drives verification + dashboard
  legal_name        text not null,                             -- as on trade licence
  trade_name        text,                                      -- brand / trading name
  commercial_register text,                                    -- CR / trade-licence number
  emirate_country   text not null default 'AE-DU',             -- ISO-3166-2 (AE-DU, AE-AZ, SA-01, QA…)
  company_email     text not null unique,                      -- all outgoing platform docs use this
  logo_path         text,                                      -- Supabase Storage key (private)
  letterhead_path   text,                                      -- header artwork for generated docs
  verification_state verification_state not null default 'pending',
  subscription_tier subscription_tier not null default 'starter',
  stripe_customer_id text,
  stripe_connect_id text,                                      -- marketplace payouts
  created_at        timestamptz not null default now(),
  archived_at       timestamptz
);
create index on organisations (party_type, verification_state);
create index on organisations (emirate_country);

create table users (
  id            uuid primary key references auth.users(id) on delete cascade,
  full_name     text not null,
  personal_email text not null,                                -- distinct from company_email
  mobile_e164   text not null,                                 -- +9715…  (E.164)
  totp_enabled  boolean not null default false,                -- mandatory for ceo/finance
  created_at    timestamptz not null default now()
);

create table organisation_members (
  id              uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  user_id         uuid not null references users(id) on delete cascade,
  role_level      role_level not null,
  is_active       boolean not null default true,               -- CEO can deactivate without deleting history
  approved_by     uuid references users(id),                   -- CEO who approved a join request; null = founder
  created_at      timestamptz not null default now(),
  unique (organisation_id, user_id)
);
create index on organisation_members (user_id);
create index on organisation_members (organisation_id, role_level);

create table verified_credentials (
  id              uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references organisations(id) on delete cascade,
  credential_type credential_type not null,
  document_path   text not null,                               -- private bucket key
  encrypted_number bytea,                                      -- pgsodium column-encrypted (EID/passport no.)
  issue_date      date,
  expiry_date     date,                                        -- drives re-verification alerts
  state           verification_state not null default 'pending',
  reviewed_by     uuid references users(id),                   -- BaytyAI verification team
  reviewed_at     timestamptz,
  created_at      timestamptz not null default now()
);
create index on verified_credentials (organisation_id, credential_type);
create index on verified_credentials (state, expiry_date);

create table professional_marketplace_profiles (        -- individual freelance professionals (not companies)
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  discipline    text not null,                                 -- 'quantity_surveyor','structural_engineer'…
  specialisms   text[] not null default '{}',
  emirate_country text not null,
  day_rate_fils bigint,
  verification_state verification_state not null default 'pending',
  created_at    timestamptz not null default now()
);
```

### 1.3 Project Lifecycle

```sql
create table projects (
  id                uuid primary key default gen_random_uuid(),
  client_org_id     uuid not null references organisations(id),   -- creator; must be party_type='client'
  name              text not null,
  location_text     text not null,
  geo               geography(point,4326),                        -- PostGIS; site coordinate
  commercial_register text,                                       -- project CR where applicable
  authority_approval_ref text,                                    -- TAMM / Dubai Municipality permit no.
  building_type     text not null,                                -- 'residential_g+12','infrastructure'…
  land_ownership    text,                                         -- title-deed reference
  fidic_book        fidic_book not null default 'red',            -- auto-selected at inception (see §4.0)
  phase             project_phase not null default 'inception',
  contract_value_fils bigint,
  retention_pct     numeric(5,2) not null default 5.00,           -- GCC norm 5–10%
  dlp_months        int not null default 12,                      -- Defects Notification Period
  created_at        timestamptz not null default now(),
  archived_at       timestamptz
);
create index on projects (client_org_id, phase);
create index on projects using gist (geo);

create table project_parties (                                    -- the join that grants project access
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  organisation_id uuid not null references organisations(id),
  party_type      party_type not null,                            -- capacity on THIS project
  appointed_by    uuid references organisations(id),              -- client appoints consultant/contractor; contractor appoints sub/supplier
  package_ref     text,                                           -- scope package (e.g. 'MEP','Facade')
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  unique (project_id, organisation_id, package_ref)
);
create index on project_parties (organisation_id, is_active);
create index on project_parties (project_id, party_type);

create table project_phases (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  phase       project_phase not null,
  started_at  timestamptz,
  completed_at timestamptz,
  gate_document_id uuid                                            -- the doc that closes the phase (e.g. PCC)
);

create table project_programmes (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  revision    text not null default 'Rev 0',
  baseline    boolean not null default false,
  milestones  jsonb not null default '[]',                        -- [{name, planned_date, actual_date, weight}]
  submitted_by uuid references organisations(id),
  approved_at timestamptz,
  created_at  timestamptz not null default now()
);

create table site_updates (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  package_ref text,
  author_id   uuid not null references users(id),
  percent_complete numeric(5,2),
  note        text,
  photo_paths text[] not null default '{}',
  geo         geography(point,4326),                              -- geotag verified against project.geo radius
  created_at  timestamptz not null default now()
);
create index on site_updates (project_id, created_at desc);
```

### 1.4 Document Management

```sql
create table documents (
  id              uuid primary key default gen_random_uuid(),
  project_id      uuid not null references projects(id) on delete cascade,
  doc_type        text not null,                                  -- 'rfi','ipc','voi','boq'… (see §3)
  reference_no    text not null,                                  -- auto: <PROJ>-<TYPE>-<seq> e.g. NEOM-RFI-0042
  originator_org  uuid not null references organisations(id),
  recipient_org   uuid references organisations(id),
  title           text not null,
  status          doc_status not null default 'draft',
  current_revision int not null default 0,
  fidic_clause    text,                                           -- '14.6','13.1'…
  language        text not null default 'en',                    -- 'en'|'ar'
  metadata        jsonb not null default '{}',                    -- typed payload per doc_type
  ai_generated    boolean not null default false,
  created_at      timestamptz not null default now(),
  archived_at     timestamptz,
  unique (project_id, reference_no)
);
create index on documents (project_id, doc_type, status);
create index on documents (originator_org);
create index on documents (recipient_org, status);

create table document_revisions (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references documents(id) on delete cascade,
  revision_code text not null,                                    -- 'Rev 0','Rev A','C1'
  body          jsonb not null,                                   -- structured content snapshot
  pdf_path      text,                                             -- rendered PDF in private bucket
  authored_by   uuid not null references users(id),
  created_at    timestamptz not null default now(),
  unique (document_id, revision_code)
);

create table document_signatures (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references documents(id) on delete cascade,
  revision_id   uuid not null references document_revisions(id),
  signed_by     uuid not null references users(id),
  role_at_signing role_level not null,                            -- captured at time of signing (immutable)
  party_at_signing party_type not null,
  signature_hash text not null,                                   -- sha256(user_id|doc|rev|ts|secret)
  signed_at     timestamptz not null default now()
);
create index on document_signatures (document_id);

create table document_transmittals (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id),
  transmittal_no text not null,                                   -- <PROJ>-TR-<seq>
  from_org      uuid not null references organisations(id),
  to_org        uuid not null references organisations(id),
  document_ids  uuid[] not null,                                  -- drawings/specs issued together
  purpose       text not null,                                    -- 'for_construction','for_approval','for_info'
  issued_by     uuid references users(id),
  issued_at     timestamptz not null default now(),
  unique (project_id, transmittal_no)
);
```

### 1.5 Approvals & Workflow

```sql
create table approval_chains (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  doc_type    text not null,                                      -- chain applies to this doc type on this project
  created_at  timestamptz not null default now(),
  unique (project_id, doc_type)
);

create table approval_steps (
  id            uuid primary key default gen_random_uuid(),
  chain_id      uuid not null references approval_chains(id) on delete cascade,
  step_order    int not null,
  approver_party party_type not null,                             -- which party must act
  approver_role role_level not null,                              -- which role level
  sla_hours     int not null default 120,                        -- 5 working days default
  requires_countersign boolean not null default false,           -- e.g. PM approval + CEO countersign
  unique (chain_id, step_order)
);

create table approval_actions (
  id            uuid primary key default gen_random_uuid(),
  document_id   uuid not null references documents(id) on delete cascade,
  step_id       uuid not null references approval_steps(id),
  actor_id      uuid not null references users(id),
  action        approval_action not null,
  comment       text,
  acted_at      timestamptz not null default now(),
  due_at        timestamptz                                       -- copied from step sla for SLA reporting
);
create index on approval_actions (document_id, acted_at);
```

### 1.6 Commercial & Financial

```sql
create table inquiries (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references projects(id),                     -- null for pure-marketplace inquiries
  issuer_org    uuid not null references organisations(id),
  target_party  party_type not null,                              -- 'supplier'|'subcontractor'|'consultant'
  title         text not null,
  scope         jsonb not null default '{}',                      -- BOQ lines / spec refs
  emirate_country text,
  closing_at    timestamptz not null,
  state         inquiry_state not null default 'open',
  visibility    text not null default 'invited',                 -- 'invited'|'public'|'anonymous'
  created_at    timestamptz not null default now()
);
create index on inquiries (target_party, state, closing_at);

create table inquiry_responses (
  id            uuid primary key default gen_random_uuid(),
  inquiry_id    uuid not null references inquiries(id) on delete cascade,
  responder_org uuid not null references organisations(id),
  total_fils    bigint not null,
  lead_time_days int,
  line_items    jsonb not null default '[]',
  technical_score numeric(5,2),                                   -- AI-scored (see §5)
  commercial_score numeric(5,2),
  submitted_at  timestamptz not null default now(),
  unique (inquiry_id, responder_org)
);

create table negotiations (
  id            uuid primary key default gen_random_uuid(),
  inquiry_id    uuid not null references inquiries(id) on delete cascade,
  response_id   uuid references inquiry_responses(id),
  sender_org    uuid not null references organisations(id),
  body          text not null,
  attachments   text[] not null default '{}',
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index on negotiations (inquiry_id, created_at);

create table purchase_orders (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references projects(id),
  lpo_no        text not null,
  buyer_org     uuid not null references organisations(id),
  supplier_org  uuid not null references organisations(id),
  inquiry_id    uuid references inquiries(id),
  total_fils    bigint not null,
  line_items    jsonb not null default '[]',
  status        text not null default 'issued',                  -- issued|acknowledged|delivered|closed
  issued_at     timestamptz not null default now(),
  unique (buyer_org, lpo_no)
);

create table payment_applications (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id),
  application_no int not null,                                    -- monthly sequential (IPA-01…)
  claimant_org  uuid not null references organisations(id),       -- contractor or subcontractor
  period_end    date not null,
  gross_fils    bigint not null,
  retention_fils bigint not null default 0,
  net_claimed_fils bigint not null,
  state         payment_state not null default 'drafted',
  fidic_clause  text not null default '14.3',
  created_at    timestamptz not null default now(),
  unique (project_id, claimant_org, application_no)
);

create table payment_certificates (
  id            uuid primary key default gen_random_uuid(),
  application_id uuid not null references payment_applications(id) on delete cascade,
  certifier_org uuid not null references organisations(id),       -- consultant (Engineer)
  certified_fils bigint not null,
  fidic_clause  text not null default '14.6',
  certified_by  uuid references users(id),
  countersigned_by uuid references users(id),                     -- CEO/Finance countersign
  certified_at  timestamptz,
  due_at        date                                              -- Clause 14.7 payment due date
);

create table variations (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id),
  variation_no  text not null,
  origin        text not null,                                    -- 'voi' (13.1) or 'vor' (13.3)
  instructed_by uuid references organisations(id),                -- consultant for VOI
  requested_by  uuid references organisations(id),                -- contractor for VOR
  description   text not null,
  valued_fils   bigint,
  time_impact_days int default 0,
  state         variation_state not null default 'instructed',
  created_at    timestamptz not null default now(),
  unique (project_id, variation_no)
);

create table retention_records (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid not null references projects(id),
  party_org     uuid not null references organisations(id),
  held_fils     bigint not null default 0,
  released_fils bigint not null default 0,
  release_trigger text,                                           -- 'pcc'|'final_completion'
  updated_at    timestamptz not null default now()
);
```

### 1.7 Marketplace, Messaging, Notifications

```sql
create table marketplace_listings (
  id            uuid primary key default gen_random_uuid(),
  inquiry_id    uuid references inquiries(id),
  poster_org    uuid not null references organisations(id),
  discipline    text not null,
  emirate_country text not null,
  required_credentials credential_type[] not null default '{}',
  visibility    text not null default 'public',
  state         inquiry_state not null default 'open',
  created_at    timestamptz not null default now()
);
create index on marketplace_listings (discipline, emirate_country, state);

create table marketplace_bids (
  id            uuid primary key default gen_random_uuid(),
  listing_id    uuid not null references marketplace_listings(id) on delete cascade,
  bidder_org    uuid references organisations(id),
  bidder_profile uuid references professional_marketplace_profiles(id),
  amount_fils   bigint not null,
  proposal      text,
  submitted_at  timestamptz not null default now()
);

create table marketplace_engagements (
  id            uuid primary key default gen_random_uuid(),
  bid_id        uuid not null references marketplace_bids(id),
  listing_id    uuid not null references marketplace_listings(id),
  amount_fils   bigint not null,
  commission_pct numeric(4,2) not null default 10.00,             -- 8–12%
  stripe_payment_intent text,
  escrow_state  text not null default 'held',                    -- held|released|refunded
  created_at    timestamptz not null default now()
);

create table message_threads (
  id            uuid primary key default gen_random_uuid(),
  project_id    uuid references projects(id),
  document_id   uuid references documents(id),
  inquiry_id    uuid references inquiries(id),
  subject       text,
  created_at    timestamptz not null default now()
);

create table messages (
  id            uuid primary key default gen_random_uuid(),
  thread_id     uuid not null references message_threads(id) on delete cascade,
  sender_org    uuid not null references organisations(id),
  sender_user   uuid not null references users(id),
  body          text not null,
  attachments   text[] not null default '{}',
  read_by       uuid[] not null default '{}',
  created_at    timestamptz not null default now()
);
create index on messages (thread_id, created_at);

create table notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  kind          text not null,                                    -- 'approval_due','rfi_received'…
  title         text not null,
  body          text not null,
  link          text,
  channels      text[] not null default '{in_app}',              -- in_app|email|whatsapp
  sla_due_at    timestamptz,
  read_at       timestamptz,
  created_at    timestamptz not null default now()
);
create index on notifications (user_id, read_at);
```

### 1.8 RLS — the reusable pattern

Enable RLS on **every** table (`alter table X enable row level security;`). Two helper functions read JWT claims:

```sql
create or replace function jwt_org() returns uuid language sql stable as
$$ select nullif(auth.jwt() ->> 'organisation_id','')::uuid $$;

create or replace function jwt_role() returns role_level language sql stable as
$$ select (auth.jwt() ->> 'role_level')::role_level $$;

-- Is my org engaged on this project (in any capacity)?
create or replace function on_project(p uuid) returns boolean language sql stable as $$
  select exists (
    select 1 from project_parties pp
    where pp.project_id = p and pp.organisation_id = jwt_org() and pp.is_active
  );
$$;

-- Authority gate for the two-axis model.
create or replace function has_authority(min role_level) returns boolean language sql stable as $$
  select case jwt_role()
    when 'ceo' then true
    when 'finance_director'    then min in ('finance_director','site_inspector')
    when 'project_manager'     then min in ('project_manager','site_inspector')
    when 'commercial_director' then min in ('commercial_director','site_inspector')
    else min = 'site_inspector'
  end;
$$;
```

**Representative policies** (the same shape repeats per table; the CTO expands to all tables):

```sql
-- organisations: a member sees their own org; anyone verified sees minimal marketplace profile via a view.
create policy org_select on organisations for select
  using (id = jwt_org());
create policy org_update on organisations for update
  using (id = jwt_org() and has_authority('ceo'));

-- projects: visible to the client owner and every engaged party.
create policy proj_select on projects for select
  using (client_org_id = jwt_org() or on_project(id));
create policy proj_insert on projects for insert
  with check (client_org_id = jwt_org()
              and (select party_type from organisations where id = jwt_org()) = 'client'
              and has_authority('ceo'));
create policy proj_update on projects for update
  using (client_org_id = jwt_org() and has_authority('project_manager'));

-- documents: originator or recipient org, and only if engaged on the project.
create policy doc_select on documents for select
  using (on_project(project_id)
         and (originator_org = jwt_org() or recipient_org = jwt_org()
              or (select party_type from organisations where id=jwt_org()) in ('client','consultant')));
create policy doc_insert on documents for insert
  with check (originator_org = jwt_org() and on_project(project_id)
              and has_authority('project_manager'));
-- No UPDATE policy → append-only. Edits go through document_revisions.
-- No DELETE policy → deletes impossible; use archived_at via a SECURITY DEFINER rpc gated to CEO.

-- payment_certificates: only the certifying consultant, finance authority, countersigned by CEO.
create policy ipc_insert on payment_certificates for insert
  with check ((select party_type from organisations where id=jwt_org()) = 'consultant'
              and has_authority('finance_director'));

-- financial isolation: a contractor never sees another contractor's payment application.
create policy pay_select on payment_applications for select
  using (claimant_org = jwt_org()
         or (on_project(project_id)
             and (select party_type from organisations where id=jwt_org()) in ('client','consultant')));
```

The invariant enforced everywhere: **subcontractors/suppliers see only rows where they are a party**; **client/consultant see project-wide**; **contractor sees own packages + own supply chain but not peer financials**; **authority verbs (`insert/sign/certify`) additionally gated by `has_authority()`**.

---

## SECTION 2 — RBAC Permission Matrix

Legend: ✅ allowed · ⚠️ conditional · ❌ denied. Role abbreviations: CEO, CD (commercial), PM, SI (site), FIN (finance).

### 2.1 Project actions

| Action | Client | Consultant | Contractor | Subcontractor | Supplier | Role gate | RLS enforcement |
|---|---|---|---|---|---|---|---|
| Create project | ✅ | ❌ | ❌ | ❌ | ❌ | CEO | `party_type='client'` on INSERT |
| Add party to project | ✅ appoints consultant/contractor | ⚠️ recommends | ✅ appoints sub/supplier | ❌ | ❌ | ≥PM | `appointed_by=jwt_org()` |
| Remove party | ⚠️ sets `is_active=false` | ❌ | ⚠️ own appointees | ❌ | ❌ | CEO | update on `project_parties` |
| Close/archive project | ✅ | ❌ | ❌ | ❌ | ❌ | CEO | SECURITY DEFINER rpc |
| View dashboard | ✅ all | ✅ all | ⚠️ own packages | ⚠️ own scope | ⚠️ own orders | any | `on_project()` |
| View project financials | ✅ | ✅ | ⚠️ own | ❌ | ❌ | ≥FIN/CD view | `pay_select` policy |
| View other party's internal docs | ❌ | ❌ | ❌ | ❌ | ❌ | — | `originator/recipient` check |

### 2.2 Document actions

| Action | Who | Role gate | Condition |
|---|---|---|---|
| Draft document | originator party | ≥PM (≥SI for site docs) | own org on project |
| Submit for approval | originator | ≥PM | moves `draft→submitted` |
| Approve | approver party per chain | role per `approval_steps` | within SLA; authority-limited |
| Reject with comments | approver | per chain | `approval_actions` audit row |
| Sign digitally | any party | ⚠️ CEO, or FIN for IPC (countersigned) | writes `document_signatures` |
| Issue transmittal | consultant/contractor | ≥PM | `for_construction` requires client approval first |
| View / download | originator, recipient, client, consultant | any | signed-URL, watermarked |
| Create revision | originator | ≥PM | new `document_revisions` row |
| Delete | nobody | — | no DELETE policy exists |

### 2.3 Commercial & marketplace & site (condensed)

| Action | Client | Consultant | Contractor | Sub | Supplier | Role |
|---|---|---|---|---|---|---|
| Send RFQ/inquiry | ✅(consultant) | ✅(specialist) | ✅(sub/supplier) | ✅(supplier) | ❌ | ≥CD |
| Respond / quote | ❌ | ⚠️ | ✅ | ✅ | ✅ | ≥CD |
| Issue LPO | ❌ | ❌ | ✅ | ✅ | ❌ | ≥CD, CEO sign |
| Submit payment application | ❌ | ❌ | ✅ | ✅ | ❌ | ≥FIN |
| Certify payment (IPC) | ❌ | ✅ | ❌ | ❌ | ❌ | FIN + CEO countersign |
| Issue variation instruction (VOI) | ⚠️ via consultant | ✅ | ❌ | ❌ | ❌ | ≥PM, FIDIC 13.1 |
| Request variation (VOR) | ❌ | ❌ | ✅ | ✅ | ❌ | ≥PM, FIDIC 13.3 |
| Post marketplace listing | ✅ | ✅ | ✅ | ✅ | ✅ | ≥CD |
| Award engagement / release escrow | poster | poster | poster | poster | poster | CEO |
| Post site update | ⚠️ | ✅ | ✅ | ✅ | ❌ | ≥SI |
| Raise inspection request (ITR) | ❌ | ⚠️ | ✅ | ✅ | ❌ | ≥SI |
| Complete inspection record | ❌ | ✅ | ❌ | ❌ | ❌ | ≥SI/PM |
| Close snagging item | ⚠️ verify | ✅ | ⚠️ action | ⚠️ action | ❌ | ≥PM |

---

## SECTION 3 — AI Document Generation Engine

### 3.1 Generation pipeline

```
POST /api/documents/generate
  → validate (tier limit, party authority via RLS)
  → assemble context from DB (project, parties, org letterhead, prior revisions)
  → Claude call (claude-sonnet-4-6, streaming, adaptive thinking)
  → structured JSON draft → insert documents(status='draft', ai_generated=true) + document_revisions('Rev 0')
  → render PDF (React-PDF, org letterhead, EN/AR) → store private bucket
  → return draft for human edit → sign → status flips to 'signed'
```

TypeScript route contract:

```ts
type GenerateDocRequest = {
  projectId: string;
  docType: DocType;              // 'rfi' | 'ipc' | 'voi' | 'boq' | ...
  language: 'en' | 'ar';
  inputs: Record<string, unknown>;   // typed per docType by a zod schema
};
type GenerateDocResponse = {
  documentId: string; referenceNo: string; revisionCode: 'Rev 0';
  pdfSignedUrl: string; editableBody: DocBody; approvalChain: ApprovalStepDTO[];
};
```

### 3.2 Auto-population map (example — Interim Payment Certificate)

| Template field | Source |
|---|---|
| Certifier letterhead | `organisations.letterhead_path` (consultant) |
| Project / employer | `projects.name`, `projects.client_org_id → legal_name` |
| Contractor | `project_parties` where `party_type='contractor'` |
| Application ref & period | `payment_applications.application_no`, `period_end` |
| Gross, retention, previous, net due | `payment_applications.*`, prior certificates |
| FIDIC clause | `14.6`; payment-due date `14.7` |

### 3.3 Document catalogue (party → recipient → FIDIC / GCC ref)

| Document | Generator → Recipient | FIDIC 2017 | GCC ref |
|---|---|---|---|
| RFQ / Inquiry | Client/Contractor/Sub → Supplier/Sub | — | — |
| Bill of Quantities (BOQ) | Consultant → Contractors | — | CESMM/POMI |
| Tender Submission | Contractor → Client/Consultant | 1.1 | — |
| Pre-Qualification (PQQ) | Contractor → Consultant | — | — |
| Tender Evaluation Report | Consultant → Client | — | — |
| Local Purchase Order (LPO) | Contractor/Sub → Supplier | — | UAE Commercial Transactions Law |
| Subcontract Agreement | Contractor → Subcontractor | — | — |
| Variation Order Instruction (VOI) | Consultant → Contractor | **13.1** | — |
| Variation Order Request (VOR) | Contractor → Consultant | **13.3** | — |
| Early Warning Notice (EWN) | any → Engineer | **8.4** | — |
| Claim Notice | Contractor → Engineer | **20.2** | — |
| Engineer's Instruction (EI) | Consultant → Contractor | **3.5** | — |
| Request for Information (RFI) | Contractor → Consultant | 1.9 | — |
| RFI Response | Consultant → Contractor | 1.9 | — |
| Material Submittal | Contractor/Sub → Consultant | 7.2 | — |
| Inspection & Test Request (ITR) | Contractor → Consultant | 7.4 | — |
| Non-Conformance Report (NCR) | Consultant → Contractor | 7.5 | — |
| Interim Payment Application (IPA) | Contractor → Consultant | **14.3** | — |
| Interim Payment Certificate (IPC) | Consultant → Client+Contractor | **14.6** | — |
| Final Payment Certificate | Consultant → Client+Contractor | **14.13** | — |
| Payment Delay Notice | Contractor → Client | **14.8** | — |
| Practical Completion Certificate (PCC) | Consultant → Contractor | **10.1** | — |
| Taking-Over Certificate (TOC) | Consultant → Client | **10.1** | — |
| Final Completion Certificate (FCC) | Consultant → Contractor | **11.9** | — |
| Monthly Progress Report | Contractor → Consultant | 4.20 | — |
| Snagging List | Consultant/Client | 10.1 | — |
| Health & Safety Plan / Risk Assessment / Method Statement | Contractor → Consultant | 4.8 | UAE MOHRE / OSHAD (Abu Dhabi), Dubai DM |

### 3.4 Example system prompts (verbatim)

**RFI (Contractor → Consultant):**

```
You are a senior contracts engineer drafting a Request for Information (RFI) under a
FIDIC 2017 Red Book contract in the UAE/GCC market. Produce a formal RFI, concise and
unambiguous, that a Resident Engineer can answer without a site meeting.

CONTEXT (from the platform database — treat as authoritative, do not invent facts):
- Project: {{project.name}}, {{project.location_text}}
- Employer: {{client.legal_name}}   Engineer: {{consultant.legal_name}}   Contractor: {{contractor.legal_name}}
- RFI reference: {{document.reference_no}}   Date: {{today}}
- Discipline / package: {{package_ref}}   Related drawing/spec: {{inputs.drawing_ref}}
- Question raised on site: {{inputs.question}}

OUTPUT a JSON object exactly: {"subject","background","specific_question","contractor_proposed_answer",
"drawing_references":[],"required_by_date","clause_reference":"1.9"}.
Rules: reference the specific drawing/spec clause; state the programme impact if unanswered;
never fabricate a drawing number not given; keep to the facts supplied. Language: {{language}}.
```

**Interim Payment Certificate (Consultant → Client + Contractor):**

```
You are the Engineer under a FIDIC 2017 Red Book contract certifying an Interim Payment
Certificate (Clause 14.6) in the UAE. You certify the amount due, applying retention and
prior payments. You never certify more than is properly due, and you state the basis for
any reduction against the Contractor's application.

CONTEXT: Employer {{client.legal_name}}; Contractor {{contractor.legal_name}};
Application {{application.application_no}} for period ending {{application.period_end}};
Gross applied AED {{application.gross/100}}; Retention {{project.retention_pct}}%;
Previously certified AED {{prior_certified/100}}; Amounts in AED (peg 3.6725).

OUTPUT JSON: {"certified_gross","retention_deducted","previously_certified","net_certified",
"reductions":[{"item","applied","certified","reason"}],"payment_due_date","clause":"14.6",
"engineer_statement"}. Compute net_certified = certified_gross − retention − previously_certified.
Show every reduction with a contractual reason. Language: {{language}}.
```

**Variation Order Instruction (Consultant → Contractor, Clause 13.1):**

```
You are the Engineer issuing a Variation under FIDIC 2017 Clause 13.1. Draft a clear,
enforceable instruction that defines the varied work, its contractual basis, and the
valuation/notice obligations it triggers on the Contractor (13.3 quotation, 20.2 notice).
CONTEXT: {{project}}, VO no {{variation.variation_no}}, description {{inputs.description}},
drawings {{inputs.drawing_refs}}. OUTPUT JSON {"instruction","scope_of_variation",
"basis_of_valuation","time_for_quotation_days","clause":"13.1"}. Do not value the work
yourself (that is the Contractor's 13.3 submission). Language: {{language}}.
```

Each generator declares its **approval chain** (Section 1.5). E.g. IPC chain: `consultant/finance_director (certify) → consultant/ceo (countersign) → issue to client + contractor`. RFI chain: `consultant/project_manager (respond within 120h SLA)`.

---

## SECTION 4 — Project Lifecycle Workflow

**Phase 0 — Inception.** Client CEO creates `projects` (name, location+geo, CR, TAMM/DM permit ref, building type, land ownership, logo, letterhead). `fidic_book` auto-selected: build-only → Red; design-build → Yellow; EPC/turnkey → Silver. Client invites a Consultant (creates `project_parties` + `notifications`); Consultant CEO accepts → verified-credential gate checks the consultant org is `verification_state='verified'` before activation. AI generates the starter set: Letter of Appointment, Contract Data (per selected book), Programme template. Gate → `design` when appointment is signed.

**Phase 1 — Design.** Consultant issues drawings via `document_transmittals` (`for_approval`). Revision control: design issues use letter revisions (Rev A/B/C) until approved, then numeric (Rev 0 = For Construction). Chain: `consultant PM draft → consultant CEO sign → client PM/CEO approve → transmittal 'for_construction'`. Client approves design packages document-by-document; a Design Change Request re-opens a revision. Gate → `tender` when the IFC set is approved.

**Phase 2 — Tender.** Consultant generates or uploads the BOQ → Client invites Contractors (marketplace or direct `project_parties` with `capacity='tender'`). Tender submissions land as `inquiry_responses`; AI produces a Tender Evaluation Report (technical/commercial/delivery weighted). Client CEO awards → Letter of Award → Contract Data countersigned by both CEOs (`document_signatures` × 2). Gate → `construction`.

**Phase 3 — Construction.** (a) Programme submission (8.3) → consultant approval → baseline `project_programmes`. (b) Monthly progress report cycle (4.20). (c) **RFI cycle**: contractor submits → routed to consultant PM, 5-working-day SLA (`approval_steps.sla_hours=120`); overdue escalates PM→CEO. (d) **Material submittal**: submit → consultant review → approve/reject-with-comments (new revision on resubmit). (e) **ITR** inspection workflow → inspection record → NCR if failed. (f) **Subcontractor appointment**: contractor issues LPO/subcontract → sub accepts → sub added to `project_parties` (sees only its package). (g) **Supplier RFQ**: contractor `inquiries` to N suppliers → `inquiry_responses` → `negotiations` → `purchase_orders`. (h) **Monthly payment cycle**: IPA (14.3) → IPC (14.6) certified by Engineer, countersigned, payment-due (14.7), delay notice (14.8) if unpaid. (i) **Variation**: VOI (13.1) or VOR (13.3) → quotation → agreed → carried to `variations.state='final_accounted'`.

**Phase 4 — Practical Completion.** Snagging list generated; items assigned/actioned/closed (`documents` doc_type='snag_item'). PC inspection → PCC (10.1) → TOC (10.1) countersigned. Retention: first 50% released on PCC per `retention_records.release_trigger='pcc'`. Gate → `dlp`.

**Phase 5 — Defects Liability Period.** `projects.dlp_months` countdown from PCC. Defect notifications issued to contractor; repairs instructed (EI) and confirmed. DLP end confirmed → FCC (11.9). Gate → `final_account`.

**Phase 6 — Final Account & Handover.** Final Payment Application → Final Account agreement → Final Payment Certificate (14.13); remaining retention released. Handover package auto-assembled: O&M manuals, as-built drawings, test certificates, warranties (bundled `document_transmittal`). Project set `phase='archived'`, `archived_at=now()`; data retained per retention schedule (§9).

---

## SECTION 5 — Marketplace & Inquiry System

**Posting.** Any party posts a `marketplace_listing` (Client→consultant selection; Contractor→sub/supplier; etc.). Required: discipline, emirate_country, scope, `required_credentials[]`, `closing_at`, visibility (`public` to all verified | `invited` | `anonymous` — issuer hidden until award). Distribution: a Postgres query fans out to verified orgs/profiles matching `discipline ∩ emirate_country ∩ has required credentials`, delivering `notifications`.

**Quotation & evaluation.** Bids land as `marketplace_bids`/`inquiry_responses`. AI evaluation matrix: Claude scores each submission on **technical (0–100)**, **commercial (price-normalised)**, **delivery (lead-time)**, then weighted (default 50/35/15) into a ranked table shown side-by-side. Clarifications via `negotiations` thread (read receipts, attachments, timestamps). Counter-offers create new `inquiry_responses` linked to the thread.

**Award & escrow.** Poster CEO awards → winner notified, unsuccessful bidders auto-notified (professional template). Engagement activates: both orgs become mutually visible on the project (`project_parties`). For professional (individual) engagements, **Stripe Connect** escrow: `PaymentIntent` with `transfer_data` held → `marketplace_engagements.escrow_state='held'` → released to the professional's connected account on milestone confirmation, BaytyAI retaining 8–12% (`commission_pct`). Refund path on non-delivery.

---

## SECTION 6 — Authentication & Onboarding

**Sign-up.** Q1 "Are you the General Manager/CEO?" → **Yes**: create company. Collect full name, mobile (GCC country selector, E.164), personal email, Emirates ID/Iqama (front+back image), employment contract PDF (proves GM status), company name, company email, company password, trade licence, establishment card, trademark cert (optional). → **No**: join existing — enter registered company email + personal details + requested role; company CEO gets a `notifications` approval request, approves/rejects (`organisation_members.approved_by`). **Party-type selection** immediately follows and is immutable — it sets verification requirements, dashboard, and feature set.

**Verification.** Each upload → `verified_credentials(state='pending')`. Automated checks: MIME/format, expiry parsing, EID checksum, UAE Pass signal where available. Manual queue: BaytyAI verification team reviews → `verified|rejected` (`reviewed_by`, `reviewed_at`). Badge: **Verified / Pending / Suspended** rendered on every outgoing document header and marketplace listing. Re-verification: trade licence annual; Emirates ID on expiry; alerts at 60/30/7 days (§7). Expedited verification: AED 150 ($41).

**Sign-in.** Company email+password, or personal email+password (redirects into the member's org with role claims). OAuth SSO (Google/Microsoft) — Enterprise/Corporate only. **Mandatory TOTP** for `ceo` and `finance_director`. Sessions: 24-hour rolling; forced re-auth for document signing and payment actions.

**Project search (real-estate marketplace).** Listings: Land for Sale, Property for Sale, Complete Project (acquisition). Fields: type, emirate/area, price_fils, area_sqm, title-deed ref, permit ref, media. Filters: type, emirate, price band, area, ownership (freehold/leasehold). Contact workflow routes an inquiry `message_thread` to the lister.

---

## SECTION 7 — Notification & Communication System

Channels: in-app (`notifications`), email (Resend + React Email), WhatsApp Business API (GCC). Each trigger has recipients, SLA, escalation. Bilingual copy stored per template (`en`/`ar`).

| Trigger | Recipients | SLA | Escalation |
|---|---|---|---|
| Project created | invited party CEO/PM | — | — |
| Party invited | invitee CEO | 72h to accept | reminder → re-invite |
| Doc submitted for approval | next approver in chain | per step | overdue → next role |
| Doc approved / rejected | submitter (+comment) | — | — |
| **RFI received** | consultant PM | **5 working days** | PM → consultant CEO |
| RFI response overdue | contractor PM + consultant CEO | — | escalation notice |
| Material submittal received | consultant review queue | 7 days | PM |
| Inspection request (ITR) | consultant SI | 48h | PM |
| Payment application submitted | consultant FIN | 28 days (14.6) | CEO |
| Payment certificate issued | client FIN, contractor FIN | — | — |
| Variation instruction (VOI) | contractor PM/CEO | 13.3 clock starts | 7/3/day-of |
| FIDIC deadline approaching | responsible role | 7d, 3d, day-of | — |
| Marketplace inquiry posted | matched verified pros | until close | — |
| Quotation received | poster CD | — | — |
| Award made | winner + losers | — | — |
| Stripe escrow released | recipient | — | — |
| Credential expiring | org CEO | 60/30/7 days | suspend on expiry |
| New member join request | company CEO | 72h | reminder |

Example copy — **RFI received** — EN: *"Action required: RFI {{ref}} on {{project}} — response due {{date}} (5 working days)."* · AR: *"إجراء مطلوب: طلب معلومات {{ref}} بخصوص مشروع {{project}} — الرد مطلوب بحلول {{date}} (٥ أيام عمل)."*
**IPC issued** — EN: *"Payment Certificate {{ref}} issued: AED {{amount}} certified, due {{date}}."* · AR: *"تم إصدار شهادة الدفع {{ref}}: تم اعتماد مبلغ {{amount}} درهم، الاستحقاق {{date}}."*

---

## SECTION 8 — Subscription & Pricing Architecture

| Tier | Price | Projects | Users | Storage | AI docs/mo | Marketplace |
|---|---|---|---|---|---|---|
| **Starter** | AED 159 / $43 | 1 active | 3 | 5 GB | 20 | view + bid |
| **Professional** | AED 559 / $152 | 10 | 15 | 50 GB | 200 | post + bid |
| **Enterprise** | AED 1,999 / $544 | unlimited | 50 | 500 GB | 2,000 | full + SSO + API |
| **Corporate** | AED 5,000+ / $1,361+ | unlimited | custom | custom | custom | white-label, dedicated, SLA, gov reporting |

**Marketplace revenue:** 8–12% commission via Stripe Connect; expedited verification AED 150 ($41); API access AED 500–2,000/mo ($136–$545).

**Feature-flag model.** `subscription_features(tier, feature_key, limit_int)` + a `usage_counters(organisation_id, feature_key, period, used_int)` table. Enforcement at the API boundary and in RLS via `check_limit()`:

```sql
create or replace function check_limit(feature text) returns boolean language sql stable as $$
  select coalesce(u.used_int,0) < f.limit_int
  from subscription_features f
  left join usage_counters u
    on u.organisation_id = jwt_org() and u.feature_key = f.feature_key and u.period = to_char(now(),'YYYY-MM')
  where f.tier = (select subscription_tier from organisations where id = jwt_org())
    and f.feature_key = feature;
$$;
-- e.g. document generation INSERT policy adds:  and check_limit('ai_docs')
```

Stripe: one Product per tier, monthly Price IDs; `checkout.session.completed` webhook sets `organisations.subscription_tier` + `stripe_customer_id`; `customer.subscription.updated/deleted` downgrades and the flag table immediately gates features.

---

## SECTION 9 — Security & Compliance Architecture

**Encryption.** At rest AES-256 (Supabase Storage + DB volumes). In transit TLS 1.3, HSTS preload, TLS 1.0/1.1 disabled at edge. Keys in Supabase Vault, never co-located with data. Column-level (pgsodium/`pgcrypto`) on: Emirates ID/passport numbers, payment identifiers, personal emails.

**Access control.** RLS everywhere (§1.8). JWT claims: `organisation_id, party_type, role_level, project_access[]`. Sessions 24h rolling; forced re-auth on sign/pay. TOTP mandatory: `ceo`, `finance_director`.

**Document security.** All verification-document buckets private, zero public URL. Access via **60-second signed URLs** from an authenticated server function. Download watermark (user name · date · org) applied by a Vercel Edge Function.

**UAE PDPL (Federal Decree-Law No. 45/2021).** TDRA data-controller registration; granular per-category consent (timestamp-stored); right-to-erasure 30-day automated workflow; DPAs with each processor (Supabase, Vercel, Stripe, Resend, Anthropic); **72-hour** TDRA breach notification.

**GCC data residency.** Year 1 EU (Frankfurt); Year 2 (post-Series A) migrate to **AWS Bahrain** on Supabase Team tier. Classification matrix: verification documents + PII → in-region required; anonymised analytics → EU permitted.

**HTTP headers (`next.config`):** `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` · `X-Frame-Options: DENY` · `X-Content-Type-Options: nosniff` · `Content-Security-Policy` strict, no inline scripts · `Referrer-Policy: strict-origin-when-cross-origin` · `Permissions-Policy: camera=(), microphone=(), geolocation=()`.

> Status honesty for diligence: RLS, AES-256/TLS 1.3, and 5 of 6 headers are baseline-implementable on the current stack today; enforcing CSP and mandatory TOTP are near-term roadmap; SOC 2 Type II is a dated roadmap (evidence period, then audit). Do not represent unbuilt controls as live.

---

## SECTION 10 — Arabic & RTL Architecture

- **i18n routing:** App Router `app/[locale]/…` with `en`/`ar`; `middleware.ts` negotiates locale; `<html lang dir>` set per locale (`dir="rtl"` for `ar`).
- **RTL layout:** Tailwind logical properties (`ps-*`/`pe-*`, `ms-*`/`me-*`, `text-start`) + `rtl:`/`ltr:` variants; never hard-code left/right.
- **Typography:** Arabic body **IBM Plex Arabic** (or Tajawal); +8% line-height vs Latin, letter-spacing 0 (Arabic must not be tracked).
- **Arabic document generation:** Claude drafts **natively in Arabic** (prompt: *"Draft in formal GCC construction Arabic used in FIDIC practice — do not translate from English; use the standard contractual register"*), not machine translation.
- **Numbers/dates:** `Intl.NumberFormat('ar-AE', {currency:'AED'})`; **Hijri** option (`ar-SA-u-ca-islamic`) for KSA; SAR/QAR formatting per project country.
- **PDF export:** React-PDF with embedded Arabic font, `direction: 'rtl'`, right-aligned tables.
- **FIDIC Arabic glossary (native terms):** Engineer = المهندس · Employer = صاحب العمل · Contractor = المقاول · Variation = أمر تغيير · Interim Payment Certificate = شهادة الدفع المرحلية · Taking-Over Certificate = شهادة الاستلام · Defects Notification Period = فترة الإخطار بالعيوب · Retention = المبلغ المحتجز · Practical Completion = الإنجاز الفعلي.

---

## SECTION 11 — Year 1 Build Sequence (one feature = one Claude session)

**Phase 1 (M1–3) Foundation.** 1) Enums + identity tables migration → `supabase/migrations/001_identity.sql`; test: tables + RLS on. 2) JWT claims hook + `jwt_org/jwt_role/on_project/has_authority` → `002_authz.sql`; test: claims present in `auth.jwt()`. 3) Auth pages `app/[locale]/(auth)/sign-up`, `sign-in`; dep: 1. 4) Onboarding wizard (GM Y/N, party-type, uploads) → `app/[locale]/onboarding/*` + `verified_credentials`; dep: 1–3. 5) Verification admin queue `app/[locale]/admin/verification`; dep: 4. 6) Projects + `project_parties` migration `003_projects.sql` + RLS; test: client-only INSERT. 7) Project create + invite flow `app/[locale]/projects/new`; Resend invite; dep: 6. 8) `documents`/`document_revisions` migration `004_documents.sql`, append-only policies; test: no UPDATE/DELETE. 9) i18n + RTL scaffold + fonts; dep: 3.

**Phase 2 (M4–6) Commerce.** 10) Claude generate route `app/api/documents/generate` + zod schemas per docType; Anthropic `claude-sonnet-4-6`; test: RFI draft persists. 11) React-PDF renderer (EN/AR, letterhead, watermark). 12) Approval engine (`approval_chains/steps/actions`) + SLA cron; dep: 8,10. 13) RFI + Material Submittal + ITR flows; dep: 12. 14) Payment applications + IPC (14.3/14.6) + retention; dep: 12. 15) Variations (VOI/VOR 13.1/13.3). 16) Stripe subscriptions + feature-flag gate `check_limit()` + webhooks; test: tier limit blocks generation.

**Phase 3 (M7–9) Marketplace.** 17) `inquiries/inquiry_responses/negotiations` + RLS; 18) marketplace listings + fan-out matcher + notifications; 19) messaging (`threads/messages`, read receipts, WhatsApp channel); 20) Stripe Connect onboarding + escrow (`marketplace_engagements`); 21) AI evaluation matrix; 22) LPO / subcontract generation + supplier RFQ loop.

**Phase 4 (M10–12) Intelligence.** 23) Transmittal register + drawing revision control; 24) programme + monthly progress reporting; 25) PCC/TOC/FCC + snagging + DLP tracker; 26) handover package assembler; 27) executive dashboard + claims/risk analytics (Claude summarisation over `approval_actions`/`documents`); 28) GCC data-residency migration to AWS Bahrain + PDPL erasure/consent module.

Each session ships: exact file paths, its migration + RLS, Claude/Stripe wiring where relevant, and a binary test criterion; every feature lists its dependency so the founding team never builds out of order.

---

*End of specification v1.0. Monetary values at US$1 = AED 3.6725. FIDIC clauses per 2017 2nd edition. This document is the technical contract between the founding team, the incoming CTO, and Series A diligence — extend the per-table RLS in §1.8 to the full table set before first production data.*
