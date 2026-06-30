# BaytyAI — Project Observation Record

**Project:** BaytyAI — Global verified marketplace & operations platform for construction & facilities management
**Prepared:** 2026-06-30
**Scope:** Tasks required to bring the core platform to a professional, production-ready release. Excludes any drawing/takeoff/estimating capability (out of scope for this record).

**Status legend:** ✅ Done · 🟡 In progress / partial · 🔴 Not started / blocked
**Priority:** P1 Critical (blocks launch) · P2 High · P3 Medium · P4 Nice-to-have

---

## 1. Summary of observations

| # | Area | Observation | Status | Priority |
|---|------|-------------|--------|----------|
| 1.1 | Marketing site | Animated, global, SEO/GEO-optimized site is live | ✅ | — |
| 1.2 | Auth & access | Email OTP login + auth-token hook fixed; admin full access | ✅ | — |
| 1.3 | RBAC & approvals | 6-role model + approval engine implemented & tested | ✅ | — |
| 1.4 | Onboarding | Org creation + stakeholder type + dashboard gate | ✅ | — |
| 1.5 | Consultant selection | TOR drafting, award report, DB-backed evaluation studio | ✅ (code) | — |
| 1.6 | DB migration 008 | Selection tables not yet applied to live database | 🔴 | **P1** |
| 1.7 | Domain / SSL | Apex `baytyai.com` SSL invalid; old Angular project still live | 🔴 | **P1** |
| 1.8 | Environment config | Several production env vars unset (Cal, Anthropic, GA) | 🟡 | P2 |
| 1.9 | PR #30 | Open, CI green, awaiting review/merge | 🟡 | P2 |
| 1.10 | Marketplace core | Inquiries/quotations exist; full browse/search UX incomplete | 🟡 | P2 |
| 1.11 | Verification (KYC) | Schema present; end-to-end verification flow incomplete | 🟡 | P2 |
| 1.12 | Testing & QA | Unit tests for logic exist; no E2E/integration coverage | 🟡 | P3 |
| 1.13 | Security hardening | RLS + secret hygiene good; needs advisors audit + rate limits review | 🟡 | P2 |
| 1.14 | Observability | No error monitoring / structured logging in production | 🔴 | P3 |
| 1.15 | Legal / compliance | Terms/privacy pages exist; data-retention & GDPR review pending | 🟡 | P3 |
| 1.16 | Documentation | Engineering docs partial; no admin/operator runbook | 🟡 | P3 |

---

## 2. Completed work (for the record)

- **2.1 Marketing & brand** — Premium animated site; globalized copy; SEO metadata, sitemap/robots, JSON-LD; GEO (AI-crawler allow-list, `/llms.txt`). ✅
- **2.2 Authentication** — Supabase email OTP; `custom_access_token_hook` repaired; admin bootstrap. ✅
- **2.3 RBAC + approvals** — `can()` matrix for 6 stakeholder types; generic approval engine; admin queue; pinned permission tests. ✅
- **2.4 Onboarding & tenancy** — Org + membership + stakeholder type; dashboard gate redirecting org-less users. ✅
- **2.5 Database baseline** — Migrations 001–007 applied & verified (core tables, RLS helpers, both admins confirmed). ✅
- **2.6 Consultant selection module** — Tested scoring/explanation engine; 11-stage wizard; AI-assisted TOR (with free fallback); print-to-PDF award report; DB-backed evaluation studio with RBAC + RLS. ✅ (code complete; see 3.1 for go-live dependency)

---

## 3. Required tasks to finish — detailed observations

### P1 — Critical (blocks a credible launch)

**3.1 Apply database migration `008_consultant_selection.sql`** 🔴
- *Observation:* The selection module's server actions reference 9 tables that do not yet exist in the live database. Until applied, the "Save scores" / persistence path returns a service error.
- *Action:* Apply via Supabase (MCP `apply_migration` or Dashboard → SQL Editor). Migration is idempotent and depends only on already-applied objects (`organizations`, `is_platform_admin()`, `current_org_id()`).
- *Acceptance:* All 9 tables present; RLS enabled; `enforce_criteria_lock()` trigger active; create-process → save-criteria → save-scores round-trips successfully.

**3.2 Fix apex domain & SSL; retire legacy deployment** 🔴
- *Observation:* `baytyai.com` (apex) shows an invalid SSL certificate; the old Angular `baytyai` Vercel project still exists alongside the new `bayty` (Next.js) project.
- *Action:* Confirm apex is served by the `bayty` project; re-issue/validate the certificate; delete the obsolete Angular project to remove ambiguity.
- *Acceptance:* `https://baytyai.com` and `https://www.baytyai.com` both resolve to the Next.js app with a valid certificate; only one production project remains.

### P2 — High

**3.3 Complete production environment configuration** 🟡
- *Observation:* Required/optional env vars unset in production: `ANTHROPIC_API_KEY` (enables AI TOR vs. template), `NEXT_PUBLIC_CAL_BOOKING_URL` (booking), `NEXT_PUBLIC_GA_ID` (analytics). Confirm `SUPABASE_SERVICE_ROLE_KEY` is server-only and that impersonation vars (`NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION`, `IMPERSONATION_SECRET`) are **absent** in production.
- *Action:* Set keys in Vercel (correct scope/visibility); verify the impersonation lockdown holds in production.
- *Acceptance:* AI features active; booking works; analytics recording; security-sensitive vars correctly scoped/absent.

**3.4 Merge PR #30** 🟡
- *Observation:* PR #30 (the three selection iterations) is open with CI green and no review comments.
- *Action:* Review and merge; confirm preview deployment of the selection flows.
- *Acceptance:* Merged to `main`; production deploy green.

**3.5 Marketplace browse/search UX** 🟡
- *Observation:* Inquiries and quotations server actions exist, but the end-user marketplace browse/search/listing experience is not fully built.
- *Action:* Build listing pages (filters by region/type/budget), inquiry detail, and quotation submission UX wired to existing gated actions.
- *Acceptance:* A client can post an inquiry; a qualified firm can browse and submit a quotation; approvals route correctly per role.

**3.6 Verification / KYC flow** 🟡
- *Observation:* KYC schema/actions exist but the full submit → review → "verified" badge lifecycle is incomplete. Verification underpins the platform's "verified marketplace" positioning.
- *Action:* Complete document upload, admin review queue, and the verified-status surfacing on marketplace profiles.
- *Acceptance:* A firm can submit verification; an admin can approve/reject; verified status is visible and gates `marketplace.appear` where intended.

**3.7 Security advisors audit & rate-limit review** 🟡
- *Observation:* RLS coverage and secret hygiene are strong, but no recent automated advisor scan; rate limiting (Upstash) coverage on sensitive endpoints should be confirmed.
- *Action:* Run Supabase advisors (security + performance); review rate limits on auth, lead, and selection API routes.
- *Acceptance:* No high-severity advisors; sensitive endpoints rate-limited.

### P3 — Medium

**3.8 End-to-end & integration tests** 🟡
- *Observation:* Strong unit coverage on pure logic (scoring, permissions, report rendering), but no E2E coverage of auth, onboarding, or the selection round-trip.
- *Action:* Add Playwright E2E for the critical paths (login → onboarding → create process → score → export). Add integration tests for server actions against a test DB/branch.
- *Acceptance:* CI runs E2E on the core journeys; green.

**3.9 Observability & error monitoring** 🔴
- *Observation:* No production error tracking or structured logging.
- *Action:* Add a free-tier error monitor (e.g. Sentry free) and structured server logs; wire an alert for 5xx spikes.
- *Acceptance:* Errors captured with stack traces; basic alerting in place.

**3.10 Legal, privacy & data-retention review** 🟡
- *Observation:* Terms/privacy pages exist; data-retention, cookie consent, and GDPR/region handling not formally reviewed.
- *Action:* Confirm retention policy, cookie consent banner, and data-subject request handling.
- *Acceptance:* Compliant baseline documented and reflected in the UI.

**3.11 Operator & engineering documentation** 🟡
- *Observation:* Partial engineering docs; no admin/operator runbook (how to verify a firm, process an approval, apply a migration, rotate keys).
- *Action:* Write a concise runbook + architecture overview + env-var reference.
- *Acceptance:* A new operator/engineer can run the platform from the docs alone.

### P4 — Nice-to-have

**3.12 Performance & accessibility pass** — Lighthouse/Core-Web-Vitals review; WCAG AA check on dashboard and forms.
**3.13 Email deliverability** — SPF/DKIM/DMARC for the sending domain; Resend domain verification.
**3.14 Analytics & funnels** — Conversion funnels for sign-up → onboarding → first action.

---

## 4. Recommended sequence

1. **3.1** apply migration 008 → **3.4** merge PR #30 → **3.2** fix apex/SSL & retire legacy → **3.3** env config. *(Makes the platform real and reachable.)*
2. **3.6** verification + **3.5** marketplace UX. *(Delivers the core "verified marketplace" promise.)*
3. **3.7** security audit + **3.8** E2E tests + **3.9** observability. *(Production hardening.)*
4. **3.10–3.14** compliance, docs, polish.

---

## 5. Open decisions for the owner

- Confirm priority order above (or reweight).
- Confirm scope of the verification/KYC flow (documents required, who approves).
- Confirm whether AI features run on the free template tier at launch or with `ANTHROPIC_API_KEY` enabled.

*End of observation record.*
