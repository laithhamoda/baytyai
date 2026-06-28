# ADR 0001 — Admin Role Impersonation (dev/preview-only)

- **Status:** Proposed (awaiting founder approval at Phase 1 checkpoint)
- **Date:** 2026-06-12
- **Decision owner:** Founder / sole admin (`info@baytyai.com`)
- **Scope:** Local development + Vercel Preview environments only. **Never production.**

---

## Context

Before the fundraising round we need to review the post-login UX for each
organization role that produces a materially different dashboard experience.
Today the platform exposes **one** dashboard whose UI varies by the
organization role injected into the Supabase JWT (`app_metadata.org_role`):

```
owner   → sees billing settings, member management, everything
admin   → sees member management + settings, no billing
manager → dashboard + projects, no settings
member  → dashboard + projects (read/write scoped by RLS)
viewer  → dashboard + projects (read-only by RLS)
```

(The five *business* personas — Client, Consultant, Contractor, Subcontractor,
Supplier — are **not yet modeled** in the schema. Per the Phase 0 report and the
founder's Option A decision, this ADR covers the five **org roles** that exist.)

Creating five fully-verified real accounts (Emirates ID + trade licence + KYC
approval + org membership) for an internal UX review is impractical. We need a
way for **the founder, and only the founder**, to land in each role's dashboard
on demand — without weakening production.

### Why a naive approach fails

The `/dashboard` middleware chain enforces four gates in order:

1. Valid Supabase session (`auth.getUser()`)
2. `identity_verifications.status = 'approved'` (KYC gate)
3. `app_metadata.org_id` present (org-membership gate)
4. Route RBAC against `app_metadata.org_role`

Gates 2 and 3 query the database **as the authenticated user id**. A cookie- or
header-based "pretend to be role X" overlay cannot satisfy them, because the
real queries still run for the real user. Any working solution must produce a
**genuine session for a user who really has** an approved KYC record, a real
membership, and the target org role.

---

## Decision

Adopt **Strategy A — Real session minting via the Supabase service-role key**,
delivered as **Strategy C in practice** (real seed users + a founder-only
switcher), entirely behind a four-layer security gate.

### How it works

1. A one-time seed script (`scripts/seed-impersonation-users.ts`, Phase 3)
   uses the **server-only service-role key** to create five deterministic seed
   users — one per org role — via `auth.admin.createUser()`. Each seed user is
   provisioned with:
   - a confirmed email (e.g. `impersonation+owner@baytyai.dev`)
   - an **approved** `identity_verifications` row (satisfies gate 2)
   - a membership in a dedicated **"Impersonation Demo Org"** at the target role
     (satisfies gates 3 and 4 once the JWT hook runs)
2. An environment-gated API route (Phase 4) lets the founder select a role.
   After passing all four security layers, it uses the service-role key to mint
   a **real session** for that role's seed user (`auth.admin.generateLink()`
   → verify → set session cookies), then redirects into `/dashboard`.
3. Because the minted JWT is genuine, **RLS is respected naturally** — the
   founder sees only the seed user's own demo data, never any real customer's
   data.

### Why not the alternatives

- **Strategy B (cookie/header overlay):** Rejected. Cannot satisfy KYC and
  org-membership gates (they hit the DB as the real user). Would also require
  scattering `if (impersonating)` branches through server components — exactly
  the kind of production-reachable code we must avoid.
- **Pure Strategy A without a switcher UI:** Acceptable but less ergonomic.
  We keep a minimal founder-only switcher (Strategy C) for screenshot workflows.

---

## Security model — four independent layers

All four must pass. Failure of **any** layer returns **404** (`notFound()`), never
403 — we do not reveal that the feature exists.

| Layer | Control | Defeats |
|-------|---------|---------|
| 1. Environment gate | `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION === 'true'` **and** `NODE_ENV !== 'production'`; module top-level `notFound()` if off | Feature shipping/active in production at all |
| 2. Admin allowlist | Current session email must be in hardcoded `ADMIN_EMAILS = ['info@baytyai.com']` (source-only, no runtime override) | Any non-founder user, even in a misconfigured preview |
| 3. Shared-secret header | `x-impersonation-token` compared to `IMPERSONATION_SECRET` (32 random bytes) via `crypto.timingSafeEqual` | CSRF / drive-by requests from a browser that has the founder's cookies |
| 4. Audit log | Every attempt (granted/denied/error) written to `impersonation_audit_log` via service-role key | Silent / non-attributable use |

### Production lock-down checklist (enforced, not assumed)

- `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION` is **unset** in Vercel Production.
- `IMPERSONATION_SECRET` is set **only** in Preview (and locally), never Production.
- Redundant `NODE_ENV !== 'production'` check means even if the flag leaked into
  a production build, the route still 404s.
- Seed users live in a dedicated demo org and have **no access to any real
  customer org** (RLS-isolated).

---

## Threat model — what could go wrong if leaked, and mitigations

| Threat | Likelihood | Impact | Mitigation |
|--------|-----------|--------|------------|
| Flag accidentally enabled in Production | Low | Critical | Redundant `NODE_ENV` guard 404s regardless; secret absent in prod so Layer 3 fails too |
| Attacker discovers the impersonation route URL | Medium | High | Layers 2+3 still block; route 404s without valid session **and** secret |
| Founder's session cookie stolen (XSS) | Low | High | Layer 3 secret header is **not** a cookie — not sent automatically by the browser; attacker also needs `IMPERSONATION_SECRET` |
| Seed users used to reach real customer data | Low | Critical | Seed users are RLS-isolated in a demo org; service-role key never reaches the browser |
| Secret committed to git | Medium | High | `IMPERSONATION_SECRET` and service-role key read from `process.env` only; `.env*` gitignored; CI secret scan |
| Audit log tampered by impersonated session | Low | Medium | Log writes use service-role client; impersonated (anon-key) session cannot write/delete the table under RLS |
| Seed users linger after fundraising | Medium | Low | Phase 6 includes a teardown script that deletes seed users + demo org |

### Residual risk accepted

The service-role key is powerful by definition. It is already required by the
existing `createServiceClient()` and is server-only. This ADR does not expand its
exposure; it only adds new server-only call sites that are themselves behind
Layers 1–3.

---

## Consequences

**Positive**
- Founder can enter any of the five org-role dashboards in seconds for screenshots.
- RLS-correct: impersonation shows realistic, isolated demo data.
- Zero production attack surface when env flags are unset (default).
- Infrastructure extends cleanly to future business-persona dashboards (add a
  `business_role` column + more seed users; same gates).

**Negative / costs**
- New env vars to manage across environments (documented in Phase 6 runbook).
- Seed users + demo org must be created (Phase 3) and torn down (Phase 6).
- Four-layer gate adds code that must be tested (Phase 2 unit tests) — this is
  intentional and the point.

**Follow-up required (separate from this ADR)**
- Blocker B2: enable the Supabase JWT custom-access-token hook, or seed users'
  `org_role` claim will be null and gate 4 will misbehave.
- Blocker B1 (`isSystemAdmin` hardcoded false) is **not** required for this
  feature and is left as-is to avoid scope creep.
