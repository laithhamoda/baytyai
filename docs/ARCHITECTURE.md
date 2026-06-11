# BaytyAI — SaaS System Architecture & Build Blueprint

> Engineering design document. Grounds the evolution of the **existing**
> BaytyAI codebase (Next.js 14 + Supabase + project-intake dashboard) into a
> multi-tenant, AI-powered SaaS platform for GCC construction & real-estate
> project management.

**Status:** Living document · **Owner:** Platform · **Last updated:** 2026-06-11

---

## 0. Guiding principle — evolve, don't rebuild

You already have a production foundation that works:

| Already built | Keep / Evolve |
|---|---|
| Next.js 14 App Router + TypeScript strict | **Keep** — this is the right core |
| Supabase (Postgres + Storage + Auth + RLS) | **Keep & extend** — RLS *is* your multi-tenant isolation |
| Project-intake dashboard (5-step wizard, KYC) | **Keep** — becomes the first "module" |
| NextAuth LinkedIn (marketing) + Supabase OTP (platform) | **Consolidate** onto Supabase Auth |
| Resend emails, Upstash rate-limiting | **Keep** |

> **Decision: Modular Monolith on Next.js, not microservices.**
> At MVP→Series-A scale, a modular monolith deployed on Vercel with Supabase as
> the data plane gives you 90% of the scalability at 10% of the ops cost.
> Microservices are a premature optimization here. We enforce module boundaries
> in code (folder + service layering), so a future extraction is mechanical.

---

## 1. Product Architecture Overview

### What BaytyAI becomes
A **vertical AI SaaS for GCC construction & real-estate project delivery** —
a multi-tenant platform where developer organizations (government entities,
master-developers, contractors) run their mega-projects with AI assistance for
document analysis, risk detection, procurement, and reporting.

### Core modules (bounded contexts)
1. **Identity & Tenancy** — orgs, members, roles, KYC, invitations
2. **Project Intake & Lifecycle** — *(exists)* wizard → active project → phases
3. **Document Intelligence** — upload → AI extraction → searchable knowledge base
4. **AI Assistant Engine** — chat over project context, task automation, agents
5. **Procurement & Vendors** — RFQs, bids, vendor scoring
6. **Billing & Subscriptions** — Stripe, tiers, feature gating, usage metering
7. **Admin & Observability** — internal ops console, audit, analytics

### Multi-tenancy model
**Shared database, shared schema, row-level isolation** via Supabase RLS, keyed
on `organization_id`. Every tenant-scoped table carries `organization_id` and a
policy `USING (organization_id = auth.jwt() ->> 'org_id')`. This is the
Salesforce/HubSpot pattern at startup cost. Upgrade path to schema-per-tenant or
DB-per-tenant only for whale enterprise customers who demand it.

### Data flow (high level)
```
User → Next.js (RSC + Client) → Server Actions / Route Handlers
     → Service Layer (business logic) → Supabase (Postgres+RLS / Storage)
                                      → AI Layer (Claude API) → Job Queue
                                      → Stripe / Resend / Upstash
```

---

## 2. Tech Stack — with justification

| Layer | Choice | Why this, not the alternative |
|---|---|---|
| **Frontend** | Next.js 14 App Router, RSC, TS strict | Already in use. RSC cuts client JS; server actions remove a whole API tier for internal calls. |
| **Styling** | Tailwind v3 + shadcn/Radix | Already in use; accessible primitives, no runtime cost. |
| **Backend** | Next.js Route Handlers + Server Actions (modular monolith) | One deploy, one language. No separate Node/Nest service to operate until traffic demands it. |
| **Database** | Supabase Postgres | Relational integrity for projects/billing; RLS gives multi-tenancy for free; realtime + storage bundled. Beats raw RDS on time-to-market. |
| **ORM / data access** | `supabase-js` + typed SQL via generated types; introduce **Drizzle** for complex migrations | Drizzle gives type-safe migrations & queries without abandoning Supabase. Prisma is heavier and fights RLS. |
| **Auth** | **Supabase Auth** (email OTP + OAuth) | Consolidate. Native RLS integration (`auth.uid()`, custom JWT claims for `org_id`/role). Drop NextAuth to remove dual-auth complexity. Clerk/Auth0 add cost + a second identity store to reconcile with RLS. |
| **AI layer** | **Claude API** (`claude-opus-4-8` for reasoning, `claude-haiku-4-5` for cheap/fast tasks) | Best long-context document reasoning; native tool-use & MCP for agents. Hybrid routing by task complexity for cost. |
| **Async jobs** | **Upstash QStash** (+ Redis already present) | Serverless-native queue; no Kubernetes. Handles AI tasks, webhooks, retries. |
| **Vector search** | **Supabase `pgvector`** | Keep embeddings next to relational data; one DB, RLS applies to vectors too. Avoids a separate Pinecone bill/store. |
| **Storage** | Supabase Storage (private buckets, RLS) | Already in use for docs/KYC. S3-compatible escape hatch later. |
| **Payments** | **Stripe** (Billing + Checkout + Customer Portal) | Industry standard; usage-based metering for AI credits. |
| **Email** | Resend + react-email | Already in use. |
| **Rate limiting** | Upstash Ratelimit | Already in use. |
| **Hosting** | Vercel (app) + Supabase (data) | Zero-ops, edge network, preview deploys. Revisit AWS/containers only at sustained scale. |
| **Observability** | Sentry + Vercel Analytics + Supabase logs | Errors, web vitals, query insight. |

---

## 3. System Architecture (textual diagram)

```
                         ┌─────────────────────────────────────────┐
                         │              CLIENT (Browser)            │
                         │   Next.js RSC pages + Client components  │
                         └───────────────────┬─────────────────────┘
                                             │ HTTPS (www.baytyai.com)
                         ┌───────────────────▼─────────────────────┐
                         │            EDGE / MIDDLEWARE             │
                         │  Auth session refresh · tenant resolve   │
                         │  RBAC gate · KYC gate · rate-limit        │
                         └───────────────────┬─────────────────────┘
                                             │
              ┌──────────────────────────────┼──────────────────────────────┐
              │                              │                               │
     ┌────────▼────────┐          ┌──────────▼──────────┐          ┌─────────▼─────────┐
     │  SERVER ACTIONS │          │   ROUTE HANDLERS    │          │   WEBHOOK HANDLERS │
     │ (internal CRUD) │          │ (/api/* public/AI)  │          │ (Stripe/QStash)    │
     └────────┬────────┘          └──────────┬──────────┘          └─────────┬─────────┘
              └──────────────┬───────────────┴───────────────┬───────────────┘
                             │      SERVICE LAYER (lib/services/*)            │
                             │  business logic · validation · authz checks    │
                             └───────┬─────────────────┬───────────────┬──────┘
                                     │                 │               │
                          ┌──────────▼──────┐ ┌────────▼───────┐ ┌─────▼──────────┐
                          │  Supabase       │ │   AI LAYER      │ │ Job Queue       │
                          │  Postgres+RLS   │ │  Claude API     │ │ Upstash QStash  │
                          │  Storage        │ │  + pgvector     │ │ (async AI/jobs) │
                          │  pgvector       │ │  prompt mgmt    │ └─────┬──────────┘
                          └─────────────────┘ └────────────────┘       │
                                     ▲                                  │
                                     └──────── async results ───────────┘
```

### Request lifecycle (AI document analysis example)
1. User uploads PDF → Server Action stores to Supabase Storage (private, RLS).
2. Action enqueues `analyze-document` job on QStash, returns immediately (optimistic UI).
3. QStash invokes `/api/jobs/analyze-document` → Service layer extracts text →
   chunks → embeds (Claude/embeddings) → stores vectors in `document_chunks`.
4. Claude summarizes + extracts entities → writes `ai_tasks` result row.
5. Supabase Realtime pushes completion → UI updates. Usage metered to billing.

### Scalability design
- **Stateless app** on Vercel → horizontal autoscale by default.
- **DB**: Supabase connection pooling (Supavisor); read-heavy → read replicas later.
- **Heavy work** never runs in request path → always QStash.
- **AI cost/latency** → model routing (Haiku for classification, Opus for reasoning) + response caching + prompt caching.

---

## 4. Database Design (production)

### Tenancy-core entities
```
organizations (id, name, slug, tier, stripe_customer_id, created_at)
  └─ has many memberships
  └─ has many projects
  └─ has many subscriptions

users (Supabase auth.users) ── profiles (id→auth.uid, full_name, avatar, locale)

memberships (id, organization_id, user_id, role, status, invited_by, created_at)
  role ∈ {owner, admin, manager, member, viewer}
  UNIQUE(organization_id, user_id)

invitations (id, organization_id, email, role, token, expires_at, accepted_at)
```

### Domain entities
```
identity_verifications (EXISTS) — user_id, status, id_front/back/selfie paths
projects (EXISTS, ADD organization_id) — org_data, project_data, scope_data,
         docs_data, status, reference_number, current_step
project_documents (EXISTS, ADD organization_id) — storage_path, document_type
document_chunks (NEW) — id, document_id, organization_id, content, embedding vector(1536)
ai_tasks (NEW) — id, organization_id, project_id, type, status, input, output,
                 model, input_tokens, output_tokens, cost_usd, created_by
ai_threads / ai_messages (NEW) — chat over project context
prompts (NEW) — versioned prompt templates (key, version, body, variables)
```

### Billing entities
```
subscriptions (id, organization_id, stripe_subscription_id, tier, status,
               current_period_end, seats)
usage_records (id, organization_id, metric, quantity, period, created_at)
  metric ∈ {ai_tokens, documents_processed, seats}
audit_log (EXISTS) — append-only: entity_type, entity_id, action, metadata
```

### Relationships (key cardinalities)
- `organizations 1—N memberships N—1 users` (many-to-many via memberships)
- `organizations 1—N projects 1—N project_documents 1—N document_chunks`
- `organizations 1—N ai_tasks` · `projects 1—N ai_threads 1—N ai_messages`
- `organizations 1—1 subscription (active)` · `1—N usage_records`

### Multi-tenant RLS pattern (every tenant table)
```sql
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON projects
  USING (organization_id = (auth.jwt() ->> 'org_id')::uuid);

-- role-gated writes
CREATE POLICY member_write ON projects FOR INSERT
  WITH CHECK (
    organization_id = (auth.jwt() ->> 'org_id')::uuid
    AND (auth.jwt() ->> 'role') IN ('owner','admin','manager')
  );
```
`org_id` and `role` are injected into the JWT via a Supabase Auth Hook
(custom access token hook) on login / org-switch.

---

## 5. Backend System Design

### API strategy
- **Server Actions** for internal, authenticated CRUD (forms, mutations) — typed, no boilerplate.
- **Route Handlers (`/api/*`)** for: AI streaming endpoints, webhooks (Stripe/QStash), public API (future), file streaming.
- **REST, not GraphQL** — simpler caching, the data graph isn't deep enough to justify GraphQL ops cost.

### Layering (strict, enforced by folders)
```
Route/Action  → thin: parse + authz + call service, never touches DB directly
Service       → business logic, orchestration, transactions
Repository    → data access (supabase queries), the only layer importing the client
AI Service    → prompt build + model call + cost metering
```

### Middleware responsibilities (composed pipeline)
1. Supabase session refresh
2. Tenant resolution (resolve active `org_id` from JWT / subdomain / path)
3. RBAC gate (route → required role map)
4. KYC gate (dashboard requires approved verification) — *exists*
5. Rate limiting (Upstash) per-user + per-org

---

## 6. Frontend Architecture

### Route groups (App Router)
```
app/
  (marketing)/            # public site — RSC, SEO
  (auth)/login            # Supabase OTP
  dashboard/              # tenant app shell (EXISTS)
    page.tsx              # overview
    projects/             # intake wizard (EXISTS) + lifecycle
    documents/            # doc intelligence
    assistant/            # AI chat
    procurement/
    settings/             # org, members, billing
    verify-identity/      # KYC (EXISTS)
  admin/                  # internal ops console
```

### State management
- **Server state** → RSC + Server Actions (default). No client cache for most reads.
- **Client interactivity** → React Hook Form + local `useState`.
- **Shared client state** (active org, theme, locale) → React Context + URL params.
- Add **TanStack Query** only for realtime/polling surfaces (AI task status, chat).

### Component system
- `components/ui/*` — shadcn primitives *(exists)*
- `components/dashboard/*` — app shell, nav *(exists)*
- `components/<module>/*` — feature components
- Bilingual EN/AR with RTL logical properties *(exists)* → promote to full i18n routing at scale.

---

## 7. AI Features Engine

### Workflows
- **Document Intelligence**: extract → chunk → embed → summarize → entity/risk extraction.
- **Project Assistant**: RAG chat grounded in org's documents + project metadata (pgvector retrieval, RLS-scoped).
- **Automations / Agents**: tool-using Claude agents (generate RFQ, draft report, flag compliance gaps) via Claude tool-use / MCP.

### Prompt management
- `prompts` table: versioned templates keyed by `key@version`, variables interpolated server-side. Never hardcode prompts in components. A/B by version.

### AI task queue
- All AI work → `ai_tasks` row (status machine: `queued→running→done/failed`) + QStash job. Idempotent, retried, cost-recorded. UI subscribes via Realtime.

### Context / memory
- Short-term: thread messages in `ai_messages`.
- Long-term: `document_chunks` (pgvector) retrieved per query, RLS-scoped to org.
- **Prompt caching** (Claude) for large static project context to cut cost/latency.

### Cost optimization
| Lever | Mechanism |
|---|---|
| Model routing | Haiku for classify/extract; Opus for reasoning/generation |
| Prompt caching | Cache system + large doc context across turns |
| Metering & caps | `usage_records` + per-tier token budgets, hard stop on overage |
| Batch | Group embeddings; async via QStash to avoid timeout retries |

---

## 8. Authentication & Security Model

- **RBAC**: roles `owner/admin/manager/member/viewer` in `memberships`; enforced in middleware (route gate) **and** Postgres RLS (data gate) — defense in depth.
- **Tenant isolation**: `org_id` JWT claim + RLS on every tenant table. No service-role key in browser, ever *(already enforced)*.
- **API security**: Zod validation at every boundary *(exists)*; webhook signature verification (Stripe/QStash); CSRF-safe via same-site server actions.
- **Encryption**: TLS in transit; Supabase at-rest encryption; private buckets + signed URLs *(exists)*; secrets only in env *(exists)*.
- **Rate limiting**: per-user + per-org sliding windows *(exists, extend per-org)*.
- **Compliance**: PDPL consent *(exists)*; append-only audit log *(exists)*.

---

## 9. Monetization System

### Tiers
| Tier | Seats | AI tokens/mo | Projects | Price |
|---|---|---|---|---|
| Free | 2 | 50K | 1 | $0 |
| Pro | 10 | 1M | 10 | $$ |
| Business | 50 | 10M | unlimited | $$$ |
| Enterprise | custom | custom | custom | sales |

### Billing logic
- Stripe Checkout → subscription; Customer Portal for self-serve.
- **Feature gating**: `lib/billing/entitlements.ts` maps tier → limits; checked in service layer + UI.
- **Usage metering**: `usage_records` aggregated nightly → Stripe usage-based price for AI overage.
- Webhooks (`/api/webhooks/stripe`) reconcile `subscriptions` status.

---

## 10. Folder Structure (target)

```
baytyai/
├── app/
│   ├── (marketing)/                 # public site
│   ├── (auth)/login/
│   ├── dashboard/                   # tenant app (EXISTS)
│   │   ├── projects/ documents/ assistant/ procurement/ settings/
│   │   └── verify-identity/         # KYC (EXISTS)
│   ├── admin/
│   └── api/
│       ├── ai/                      # streaming AI endpoints
│       ├── jobs/                    # QStash job handlers
│       └── webhooks/                # stripe, qstash
├── components/
│   ├── ui/                          # shadcn (EXISTS)
│   ├── dashboard/                   # shell, nav (EXISTS)
│   └── <module>/
├── lib/
│   ├── supabase/                    # client/server (EXISTS)
│   ├── services/                    # business logic per module
│   │   ├── projects/ documents/ billing/ tenancy/
│   ├── repositories/                # data access (only layer touching DB)
│   ├── ai/                          # client, prompts, agents, embeddings
│   │   ├── client.ts prompts/ agents/ embeddings.ts cost.ts
│   ├── billing/                     # stripe, entitlements, metering
│   ├── auth/                        # rbac, tenant-resolve
│   ├── validations/                 # zod schemas (EXISTS)
│   ├── rate-limit.ts site-url.ts    # (EXISTS)
├── supabase/
│   └── migrations/                  # SQL migrations (EXISTS)
├── emails/                          # react-email (EXISTS)
├── middleware.ts                    # auth+tenant+rbac+kyc (EXISTS)
└── next.config.mjs                  # (EXISTS)
```

> No `/frontend` `/backend` split — it's one Next.js app (modular monolith).
> Module boundaries are enforced by `lib/services/<module>` + `lib/repositories`.

---

## 11. Build scaffold — starter pieces

### Entitlements gate (`lib/billing/entitlements.ts`)
```ts
export const TIER_LIMITS = {
  free:       { seats: 2,  aiTokens: 50_000,     projects: 1 },
  pro:        { seats: 10, aiTokens: 1_000_000,  projects: 10 },
  business:   { seats: 50, aiTokens: 10_000_000, projects: Infinity },
  enterprise: { seats: Infinity, aiTokens: Infinity, projects: Infinity },
} as const;

export type Tier = keyof typeof TIER_LIMITS;

export function can(tier: Tier, metric: keyof typeof TIER_LIMITS['free'], used: number) {
  return used < TIER_LIMITS[tier][metric];
}
```

### AI service with cost metering (`lib/ai/client.ts`)
```ts
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const MODELS = {
  reason:  'claude-opus-4-8',
  fast:    'claude-haiku-4-5-20251001',
} as const;

export async function runAI(opts: {
  task: 'reason' | 'fast';
  system: string;
  messages: Anthropic.MessageParam[];
  orgId: string;
}) {
  const res = await anthropic.messages.create({
    model: MODELS[opts.task],
    max_tokens: 4096,
    system: opts.system,
    messages: opts.messages,
  });
  // record usage → usage_records (orgId, 'ai_tokens', in+out)
  return res;
}
```

### Tenant resolution helper (`lib/auth/tenant.ts`)
```ts
import { createClient } from '@/lib/supabase/server';

export async function getActiveOrg() {
  const supabase = await createClient();
  if (!supabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const orgId = (user.app_metadata as { org_id?: string })?.org_id ?? null;
  const role  = (user.app_metadata as { role?: string })?.role ?? 'member';
  return { userId: user.id, orgId, role };
}
```

### Env structure (`.env.example` additions)
```env
# AI
ANTHROPIC_API_KEY=
# Billing
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
# Jobs
QSTASH_TOKEN=
QSTASH_CURRENT_SIGNING_KEY=
```

---

## 12. MVP Roadmap (5 weeks)

| Week | Focus | Deliverables |
|---|---|---|
| **1** | Tenancy foundation | `organizations`, `memberships`, `invitations` tables + RLS; JWT org_id/role hook; org-switcher UI; consolidate auth onto Supabase (retire NextAuth) |
| **2** | RBAC + settings | Role gates in middleware + RLS; org settings, member management, invitations email flow |
| **3** | Core SaaS module | Add `organization_id` to projects/documents; project lifecycle beyond intake; documents module + storage |
| **4** | AI engine | `pgvector` setup; document chunking + embeddings; `ai_tasks` + QStash queue; RAG assistant chat; prompt table; cost metering |
| **5** | Billing + ship | Stripe Checkout + Portal + webhooks; `subscriptions`/`usage_records`; entitlements gating; Sentry; production hardening + launch |

---

## Open assumptions
- Domain confirmed as **construction/real-estate project management** (matches existing intake/KYC).
- **Anthropic Claude** as primary LLM (your existing brand fit); OpenAI can be added behind the same `lib/ai` interface if needed.
- Single-region (eu-central-1, matches Supabase) at MVP; multi-region is post-PMF.
- Keep modular monolith until sustained scale signals justify extracting the AI worker into its own service.
