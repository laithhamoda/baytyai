# BaytyAI — Operations Runbook

Practical, step-by-step procedures for running BaytyAI in production. Audience:
platform admins and engineers. Keep this current as flows change.

Project references:
- **Supabase project:** `icsxyrjxpmdtyjpxbnsb` (region eu-central-1)
- **Vercel project:** `bayty` (Next.js) — apex `baytyai.com`
- **Repo:** `laithhamoda/baytyai`

---

## 1. Go-live checklist

1. **DNS / SSL** — apex `baytyai.com` must resolve **only** to Vercel. Remove any
   registrar parking A-records (see §6). Confirm `https://baytyai.com` loads with a
   valid certificate in a normal browser.
2. **Environment variables** (Vercel → bayty → Settings → Environment Variables,
   Production) — see §5. Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only and the
   impersonation vars are **absent** in Production.
3. **Database migrations** — all applied and verified (see §4).
4. **Admin accounts** — confirm the founder/admin profiles have `role = 'admin'`.
5. **Smoke test** — sign in, complete onboarding, request verification, approve it
   as admin, post an inquiry, submit a quotation from another org.

---

## 2. Verify an organization (manual, admin-only)

Verification is **never automatic**. Only a platform admin grants it, and only
verified orgs can post inquiries or submit quotations.

1. The org owner goes to **/dashboard/verification** and clicks **Request
   verification** (optionally adds notes). Status → `pending`.
2. Admin opens **/admin/verifications** — the pending queue.
3. Review the org (name, stakeholder type, notes). Click **Verify** to approve, or
   **Reject** (a reason is required; the org sees it and can re-submit).
4. On approval the org's `verification_status` → `verified`; the marketplace gates
   open immediately. Every decision is written to `audit_log`.

To verify directly in SQL (break-glass only):
```sql
update public.organizations
  set verification_status='verified', verified_at=now()
  where id = '<org-uuid>';
```

---

## 3. Review approval-gated actions

Some actions (e.g. inquiries from subcontractors/suppliers) require approval.

1. Admin opens **/admin/approvals**.
2. Approve or reject each pending item (rejection requires a reason).
3. Approval advances the gated entity (e.g. publishes the inquiry).

---

## 4. Database migrations

Migrations live in `supabase/migrations/`. Apply in order; all are idempotent.

| File | Purpose |
|------|---------|
| 001–005 | Project intake, tenancy, impersonation audit, admin bootstrap, auth-hook fix |
| 006 | RBAC + marketplace primitives (inquiries/quotations/approvals) |
| 007 | Platform-admin full access on every table |
| 008 | Consultant selection (9 tables + lock trigger) |
| 009 | Organization verification |

**Apply (MCP):** use Supabase `apply_migration` with the file contents.
**Apply (dashboard):** Supabase → SQL Editor → paste file → Run.

**Verify after applying:**
```sql
-- tables present
select count(*) from pg_tables where schemaname='public'
  and tablename in ('selection_processes','criteria','evaluations','organizations');
-- RLS advisor: expect no rls_enabled_no_policy on app tables
-- (run: get_advisors type=security)
```

---

## 5. Environment variables

Server-only secrets must never be `NEXT_PUBLIC_*`.

| Variable | Scope | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase client |
| `SUPABASE_SERVICE_ROLE_KEY` | **server only** | privileged server ops; never expose |
| `ANTHROPIC_API_KEY` | server only | AI TOR drafting / proposal summaries (falls back to free template if unset) |
| `RESEND_API_KEY`, `LEAD_*`, `DASHBOARD_*` | server only | transactional email |
| `UPSTASH_REDIS_REST_*` | server only | rate limiting |
| `NEXT_PUBLIC_CAL_BOOKING_URL` | public | booking embed |
| `NEXT_PUBLIC_GA_ID` | public | analytics |
| `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION`, `IMPERSONATION_SECRET` | **absent in Production** | dev/E2E only |

---

## 6. Fix apex domain / SSL (`ERR_CERT_COMMON_NAME_INVALID`)

Cause: the apex (and/or `www`) has a leftover registrar **parking A-record**
alongside the Vercel record, so browsers intermittently hit a server presenting a
cert that doesn't match `baytyai.com`.

Fix at the DNS host (currently **Dynadot**, nameservers `*.dyna-ns.net`):
1. Set the domain to **custom DNS records** (not Parking/Forwarding).
2. **Apex `@`:** a single **A → `216.198.79.1`** (confirm the exact value in Vercel →
   bayty → Settings → Domains → `baytyai.com`). Delete any other apex A record
   (e.g. `69.46.46.110`).
3. **`www`:** a single **CNAME → `cname.vercel-dns.com`**. Delete any `www` A record.
4. Wait for propagation (~5–60 min). Vercel auto-issues the Let's Encrypt cert.

Verify resolution:
```bash
node -e "require('dns').promises.resolve4('baytyai.com').then(console.log)"
# expect ONLY Vercel IP(s); no 69.46.46.x
```

---

## 7. Admin accounts & key rotation

- **Grant admin:** set `profiles.role = 'admin'` for the user id. The
  `custom_access_token_hook` adds the role claim on next login.
- **Rotate Supabase keys:** Supabase → Settings → API → roll the key, update the
  Vercel env var, redeploy.
- **Rotate `ANTHROPIC_API_KEY`:** update the Vercel env var; no redeploy of code
  needed (read at request time), but trigger a redeploy to refresh the runtime.

---

## 8. Incident quick reference

| Symptom | First check |
|---------|-------------|
| Login "code invalid/expired" | Supabase Auth logs; the `custom_access_token_hook` must pass through on error (migration 005) |
| "Service unavailable" from an action | Supabase env vars set in Vercel; project not paused |
| Marketplace post/quote blocked | org `verification_status` — must be `verified` (§2) |
| Cert warning on apex | DNS parking record (§6) |
| RLS denying expected reads | run security advisor; confirm the table's org policy exists |

---

*Keep this runbook beside `docs/OBSERVATION_RECORD.md` (open tasks) and
`docs/runbooks/impersonation.md` (E2E/impersonation).*
