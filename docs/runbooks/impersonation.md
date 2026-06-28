# Runbook — Admin Role Impersonation (dev/preview only)

How to provision, run, and tear down the founder-only role-impersonation system.
**Never enable this in production.** See `docs/adr/0001-admin-role-impersonation.md`.

---

## 0. One-time prerequisites

### 0.1 Apply the audit-log migration
Run `supabase/migrations/003_impersonation_audit.sql` in the Supabase SQL Editor
(creates `impersonation_audit_log`, RLS-locked to service-role only).

### 0.2 Enable the JWT hook (required for org_role in the JWT)
Supabase → Authentication → Hooks → **Custom Access Token** →
`public.custom_access_token_hook`. Without this, seed users' `org_role` claim is
null and the dashboard RBAC gate misbehaves.

### 0.3 Generate the impersonation secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the 64-char output — it is your `IMPERSONATION_SECRET`.

---

## 1. Environment variables

Set these **only** locally (`.env.local`) and in the **Vercel Preview**
environment. **Leave them unset in Production.**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION` | `true` |
| `IMPERSONATION_SECRET` | the 64-char hex string from step 0.3 |
| `NEXT_PUBLIC_SUPABASE_URL` | (already set) |
| `SUPABASE_SERVICE_ROLE_KEY` | (already set — server only) |

> Production lock-down: `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION` and
> `IMPERSONATION_SECRET` must be **absent** in Production. The redundant
> `NODE_ENV !== 'production'` check means even if the flag leaked, the feature
> stays off.

---

## 2. Provision the seed users
```bash
pnpm seed:impersonation
```
Creates five auth users (`impersonation+{role}@baytyai.com`), each with an
approved KYC record and a membership in the "Impersonation Demo Org"
(enterprise tier). Idempotent — safe to re-run.

---

## 3. Use the switcher (manual UX review)
1. Deploy/run with the env vars from step 1.
2. Log in as the founder (`info@baytyai.com`) and open any `/dashboard` page.
3. The **Role preview** panel appears bottom-right (founder + dev/preview only).
4. Click a role → you land in that role's dashboard.
5. Click another role to switch, or **Return to admin** to restore your session.

---

## 4. Run the E2E suite
```bash
# install browsers once (needs network)
npx playwright install chromium

# point at a running app (local dev or a Preview URL)
PLAYWRIGHT_BASE_URL=http://localhost:3000 pnpm test:e2e
```
The `setup` project authenticates the founder automatically (service-role magic
link → /auth/callback) and saves `.auth/founder.json`; the specs then exercise
all five roles plus the security layers (missing/wrong secret, bad role,
unauthenticated caller → all 404).

---

## 5. Audit trail
Every attempt is logged to `impersonation_audit_log`:
```sql
select created_at, requester_email, target_role, result, detail
from impersonation_audit_log
order by created_at desc
limit 50;
```

---

## 6. Teardown (after the review / before any production cutover)
```bash
pnpm teardown:impersonation   # deletes the 5 seed users + demo org
```
Then remove `NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION` and `IMPERSONATION_SECRET`
from all environments. (Teardown script lands in Phase 6.)
