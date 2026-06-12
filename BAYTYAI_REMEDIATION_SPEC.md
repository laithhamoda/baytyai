# BaytyAI.com — Master Remediation Specification
> Generated: 2026-06-12T11:00:00+03:00
> Source audits consolidated: 3
> Total findings: 25 unified (REM-001 … REM-025)
> Target stack: Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui, Supabase, Vercel
> Intended executor: Claude Code (Anthropic CLI)
> Repository ground-truth verified: 2026-06-12 (see inline "VERIFIED" notes — many audit findings are false positives)

## 1. Executive Summary

BaytyAI.com is a functional Next.js 15 App Router SaaS marketing site plus an authenticated dashboard. A live codebase audit on 2026-06-12 found that **the majority of the "Critical/High" findings across the three source audits are false positives** caused by static crawlers that did not execute the site's client-rendered React (login form, request-access labels, FAQ accordion, cookie decline button, viewport meta, and JSON-LD all exist and are correct). The genuinely launch-relevant risks are narrower: (1) a split, duplicated authentication surface — `/sign-in` (legacy `AuthForm`) still ships alongside the working passwordless `/login`, confusing users and investors; (2) no Open Graph / Twitter share image, so every social and investor link renders blank; (3) a duplicate lead-capture route (`/demo` vs `/request-access`); (4) no analytics event instrumentation despite a consent-gated GA4 loader being present; and (5) no `data-testid` coverage, blocking reliable E2E tests during an active fundraise. Two accessibility gaps (skip link, focus outline) were already remediated on 2026-06-12. Estimated total remediation: **~4.5 engineer-days** (27 productive hours) across 7 PRs, with trust-blockers shippable within 24 hours.

## 2. Consolidated Finding Registry

| id | title | source_ids | severity | confidence | requires_verification | category | impacted_routes |
|----|-------|-----------|----------|-----------|----------------------|----------|-----------------|
| REM-001 | Split/duplicate auth surface: `/sign-in` legacy form vs `/login` | A1:split-routing, A2:F-001, A3:F-001 | Critical | High | false (VERIFIED both exist) | Conversion/Trust | `/sign-in`, `/login` |
| REM-002 | "Blank /login page" | A1:blank-login, A2:F-001, A3:F-001 | Critical | High | false (VERIFIED resolved) | Conversion | `/login` |
| REM-003 | Draft/legal-disclaimer banner leak on legal pages | A1:legal-banner | High | Medium | true | Trust | `/privacy`, `/terms`, `/cookies` |
| REM-004 | Founder/placeholder content on About | A1:founder-placeholder | High | Low | true | Trust | `/about` |
| REM-005 | Missing Open Graph / Twitter share image | A1:og-image | High | High | false (VERIFIED missing) | SEO/Trust | all |
| REM-006 | Duplicate lead route `/demo` vs `/request-access` | A1:demo-duplicate | Medium | High | false (VERIFIED both exist) | Conversion | `/demo`, `/request-access` |
| REM-007 | Missing skip-to-content link | A3:F-004 | High | High | false (FIXED 2026-06-12) | Accessibility | all |
| REM-008 | No visible keyboard focus outline | A3:F-007, A2:aria | Medium | High | false (FIXED 2026-06-12) | Accessibility | all |
| REM-009 | Missing form labels on Request Access | A3:F-002 | High | High | false (VERIFIED present) | Accessibility | `/request-access` |
| REM-010 | FAQ answers hidden/inaccessible | A3:F-003 | High | High | false (VERIFIED accessible) | Accessibility | `/faq` |
| REM-011 | Cookie banner has no decline option | A3:F-006 | Medium | High | false (VERIFIED present) | Privacy | all |
| REM-012 | Missing viewport meta tag | A3:F-008, A2:meta | High | High | false (Next.js default) | Performance/SEO | all |
| REM-013 | Missing image alt text | A3:F-009 | Low | High | false (no `<img>` tags) | Accessibility | all |
| REM-014 | Decorative numerals/symbols not `aria-hidden` | A3:F-005, A1:decorative | Low | Medium | true | Accessibility | `/` |
| REM-015 | Color-contrast failures | A2:contrast | Medium | Low | true | Accessibility | all |
| REM-016 | Touch/target size below 24×24 (WCAG 2.2) | A1:touch, A2:F-008, A3:touch | Medium | Low | true | Accessibility | all |
| REM-017 | Form validation feedback missing | A1:validation, A2:F-009, A3:forms | Medium | Medium | true | Conversion/UX | `/request-access`, `/login` |
| REM-018 | No `data-testid` attributes for E2E | A2:F-002 | High | High | false (VERIFIED absent) | Testability | all critical paths |
| REM-019 | Unoptimized hero image / no lazy loading | A1:assets, A2:F-003, A3:F-010 | Medium | Medium | true | Performance | `/` |
| REM-020 | No analytics event instrumentation | A1:analytics, A2:F-007 | High | High | false (loader present, events absent) | Analytics | all |
| REM-021 | Supabase upload lacks magic-byte validation | A1:upload-security | High | Medium | true | Security | dashboard upload |
| REM-022 | Missing JSON-LD structured data | A1:json-ld | Low | High | false (VERIFIED present) | SEO | all |
| REM-023 | Arabic locale / RTL absent | A1:i18n | Medium | Medium | true | i18n | `/ar`, all |
| REM-024 | Missing ARIA labels on icon-only buttons | A2:F-004 | Medium | Low | true | Accessibility | all |
| REM-025 | SEO meta completeness (canonical, robots) | A2:F-006 (seo:45) | Low | Medium | true | SEO | all |

**Severity legend:** highest severity from any source is used. **Confidence:** likelihood the issue is real after live verification.

## 3. Verification Protocol

Run each block from the repo root before writing any fix. "PROCEED" = confirmed, build the fix. "SKIP" = false positive, mark resolved in the PR description, write no code.

```bash
# REM-003 — legal/draft banner leak
rg -n "draft|not legal advice|coming soon|placeholder|lorem|TODO" app/privacy app/terms app/cookies
# Output with a visible on-page banner string -> PROCEED (remove/guard it)
# Only legitimate legal copy -> SKIP

# REM-004 — founder placeholder
rg -n "founder|Founder|CEO|TBD|Coming soon|Lorem|John Doe|@example" app/about
# Placeholder names/bios -> PROCEED (replace with real or remove section)
# No output / real content -> SKIP

# REM-005 — OG image (expected: no output == confirmed missing)
rg -n "openGraph|opengraph-image|twitter-image" app
fd -e png -e jpg "opengraph-image|twitter-image" app
# No output -> PROCEED (add app/opengraph-image.tsx)

# REM-014 — decorative numerals/symbols
rg -n '">0?[0-9]<|aria-hidden' components/sections/feature-tiles.tsx components/sections/marketplace-join.tsx
# Step numbers rendered as plain text WITHOUT aria-hidden -> PROCEED
# Already wrapped in aria-hidden -> SKIP

# REM-015 — contrast (requires runtime, not grep)
# Run: pnpm dlx @axe-core/cli https://www.baytyai.com --tags wcag2aa
# Any "color-contrast" violation -> PROCEED on the listed selectors only

# REM-016 — target size (runtime)
# Run axe with 'target-size' rule or manual measure of nav/footer icon buttons
# Any interactive target < 24x24 CSS px -> PROCEED

# REM-017 — form validation feedback
rg -n "setError|aria-invalid|role=\"alert\"|FormMessage" components/forms/LeadCaptureForm.tsx app/login/login-client.tsx
# No inline per-field error rendering -> PROCEED (add aria-invalid + messages)

# REM-019 — image optimization
rg -n "next/image|<img|loading=" components/sections/hero.tsx
# Raw <img> or background-image for hero -> PROCEED (migrate to next/image)
# Already next/image with priority -> SKIP

# REM-021 — upload magic-byte validation
rg -n "file-type|fileTypeFromBuffer|magic|mimetype|image/" app/actions/projects/upload-document.ts
# Only client mimetype trust, no server magic-byte check -> PROCEED (flag backend)

# REM-023 — i18n / RTL
rg -n "next-intl|dir=\"rtl\"|getLocale|NextIntlClientProvider" app middleware.ts
# Only a static /ar stub, no next-intl routing -> PROCEED (scope as i18n epic)

# REM-024 — icon-only buttons missing labels
rg -n "<button" -A2 components/navigation.tsx components/footer.tsx | rg -n "aria-label" || echo "MISSING_LABELS"
# MISSING_LABELS for icon-only controls -> PROCEED

# REM-025 — SEO meta completeness
rg -n "alternates|canonical|robots" app/layout.tsx app/sitemap.ts
# No canonical/robots strategy -> PROCEED (low priority)
```

## 4. Remediation Plan

### REM-001 — Unify auth: redirect `/sign-in` to `/login`, retire `AuthForm`

```yaml
finding_id: REM-001
title: Unify split auth surface
category: Conversion/Trust
severity: Critical
files_to_modify:
  - path: app/sign-in/page.tsx
    change_type: edit
    description: Replace legacy AuthForm render with a permanent redirect to /login
  - path: components/auth-form.tsx
    change_type: delete
    description: Remove dead legacy auth component once no route imports it
  - path: components/navigation.tsx
    change_type: edit
    description: Confirm all "Sign In" links point to /login (already done 2026-06-12)
implementation_steps:
  - step: Convert /sign-in into a server redirect so old links and bookmarks resolve to the working flow.
    code_diff: |
      // app/sign-in/page.tsx
      import { redirect } from 'next/navigation';
      export default function SignInPage() {
        redirect('/login');
      }
  - step: Grep for remaining importers before deleting AuthForm.
    code_diff: |
      # rg -n "auth-form|AuthForm" app components
      # If zero results after the redirect edit, delete components/auth-form.tsx
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required:
  - none
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect, devices } from '@playwright/test';
    for (const vp of [{}, devices['iPhone 13']]) {
      test(`/sign-in redirects to /login ${JSON.stringify(vp)}`, async ({ browser }) => {
        const ctx = await browser.newContext(vp);
        const page = await ctx.newPage();
        await page.goto('/sign-in');
        await expect(page).toHaveURL(/\/login$/);
        await expect(page.getByTestId('login-email')).toBeVisible();
        await ctx.close();
      });
    }
  unit_rtl: |
    // not applicable — server redirect has no client render
  manual_qa_steps:
    - Visit https://<preview>/sign-in and confirm URL becomes /login
    - Confirm header and footer "Sign In" links land on /login
acceptance_criteria:
  - GET /sign-in issues a redirect (307/308) to /login
  - No route imports components/auth-form.tsx after the change
  - Login email field is visible after redirect
rollback_plan: git revert the REM-001 commit (restores AuthForm render)
effort_minutes: 30
confidence: high
```

### REM-002 — "Blank /login" (false positive, document only)

```yaml
finding_id: REM-002
title: Verify login form renders (no code change)
category: Conversion
severity: Critical
files_to_modify: []
implementation_steps:
  - step: Confirm app/login/login-client.tsx renders an email field and submit button; the audit crawler missed it because the page is a client component.
    code_diff: |
      # rg -n "signInWithOtp|Send sign-in link|type=\"email\"" app/login/login-client.tsx
      # Non-empty output -> resolved, no PR code needed (covered by REM-018 testid + REM-001 e2e)
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required:
  - none
data_testid_additions:
  - selector: data-testid="login-email"
    location: app/login/login-client.tsx
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('login form renders', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByTestId('login-email')).toBeVisible();
      await expect(page.getByTestId('login-submit')).toBeVisible();
    });
  unit_rtl: |
    import { render, screen } from '@testing-library/react';
    import LoginClient from '@/app/login/login-client';
    test('renders email input', () => {
      render(<LoginClient />);
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  manual_qa_steps:
    - Load /login and confirm the email field and submit button are visible
acceptance_criteria:
  - login-email and login-submit testids exist and are visible
rollback_plan: n/a (additive testids only)
effort_minutes: 15
confidence: high
```

### REM-003 — Remove/guard draft or legal-disclaimer banner leak

```yaml
finding_id: REM-003
title: Guard draft/legal banner on production
category: Trust
severity: High
files_to_modify:
  - path: LIKELY app/privacy/page.tsx | app/terms/page.tsx | app/cookies/page.tsx
    change_type: edit
    description: Remove any "draft"/"not legal advice"/"coming soon" banner, or gate behind env flag
implementation_steps:
  - step: Run the REM-003 verification grep. If a banner string is rendered on-page, remove it or wrap it.
    code_diff: |
      // Example guard if the team wants to keep it for staging only:
      {process.env.NEXT_PUBLIC_SHOW_DRAFT_NOTICE === 'true' && (
        <p role="note" className="text-xs text-offwhite/50">Draft — internal review</p>
      )}
dependencies_to_install: []
env_vars_to_add:
  - name: NEXT_PUBLIC_SHOW_DRAFT_NOTICE
    value: "false"
    location: .env.local, Vercel dashboard (Production = false)
backend_changes_required:
  - none
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    for (const p of ['/privacy', '/terms', '/cookies']) {
      test(`no draft banner on ${p}`, async ({ page }) => {
        await page.goto(p);
        await expect(page.getByText(/draft|not legal advice|coming soon/i)).toHaveCount(0);
      });
    }
  unit_rtl: |
    // not applicable — static server pages
  manual_qa_steps:
    - Open each legal page in production mode; confirm no draft/disclaimer banner is visible
acceptance_criteria:
  - No draft/disclaimer banner renders when NEXT_PUBLIC_SHOW_DRAFT_NOTICE is unset/false
rollback_plan: git revert; or set env flag true
effort_minutes: 30
confidence: medium
```

### REM-004 — Replace founder/placeholder content on About

```yaml
finding_id: REM-004
title: Replace About placeholder content
category: Trust
severity: High
files_to_modify:
  - path: LIKELY app/about/page.tsx
    change_type: edit
    description: Replace placeholder founder names/bios with real content, or remove the section until ready
implementation_steps:
  - step: Run REM-004 grep. If placeholders exist, replace with founder-supplied copy (see Section 10 open question) or remove the block.
    code_diff: |
      # Pending founder input. If no real bios yet, delete the placeholder section
      # rather than ship "John Doe / TBD" during a fundraise.
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required:
  - none
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('about has no placeholder names', async ({ page }) => {
      await page.goto('/about');
      await expect(page.getByText(/john doe|tbd|lorem|placeholder/i)).toHaveCount(0);
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Confirm About page shows real team content or no placeholder block
acceptance_criteria:
  - No placeholder strings render on /about
rollback_plan: git revert
effort_minutes: 30
confidence: low
```

### REM-005 — Add Open Graph / Twitter share image

```yaml
finding_id: REM-005
title: Add OG and Twitter share images
category: SEO/Trust
severity: High
files_to_modify:
  - path: app/opengraph-image.tsx
    change_type: create
    description: Generate a 1200x630 branded OG image via next/og ImageResponse
  - path: app/twitter-image.tsx
    change_type: create
    description: Re-export the OG image for Twitter cards
  - path: app/layout.tsx
    change_type: edit
    description: Add openGraph and twitter metadata blocks
implementation_steps:
  - step: Create the OG image route using the built-in next/og runtime (no new dependency).
    code_diff: |
      // app/opengraph-image.tsx
      import { ImageResponse } from 'next/og';
      export const runtime = 'edge';
      export const alt = 'Bayty — verified construction management for the GCC';
      export const size = { width: 1200, height: 630 };
      export const contentType = 'image/png';
      export default function OG() {
        return new ImageResponse(
          (
            <div style={{ width: '100%', height: '100%', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              background: '#0A1628', color: '#C9A84C', fontSize: 84,
              fontWeight: 600, letterSpacing: '0.1em' }}>
              BAYTY
            </div>
          ), { ...size });
      }
  - step: Re-export for Twitter.
    code_diff: |
      // app/twitter-image.tsx
      export { default, runtime, alt, size, contentType } from './opengraph-image';
  - step: Declare metadata so crawlers pick the image up.
    code_diff: |
      // app/layout.tsx — extend the existing metadata export
      openGraph: { type: 'website', siteName: 'Bayty',
        url: 'https://www.baytyai.com',
        title: 'Bayty', description: 'Verified construction management for the GCC.' },
      twitter: { card: 'summary_large_image', title: 'Bayty',
        description: 'Verified construction management for the GCC.' },
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required:
  - none
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('OG image route returns image', async ({ request }) => {
      const res = await request.get('/opengraph-image');
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toContain('image/png');
    });
  unit_rtl: |
    // not applicable — edge image route
  manual_qa_steps:
    - Paste the production URL into the Meta/LinkedIn Post Inspector; confirm the card renders
acceptance_criteria:
  - GET /opengraph-image returns 200 image/png at 1200x630
  - Page head contains og:image and twitter:card meta
rollback_plan: git revert (removes routes + metadata)
effort_minutes: 45
confidence: high
```

### REM-006 — Consolidate `/demo` into `/request-access`

```yaml
finding_id: REM-006
title: Consolidate duplicate lead routes
category: Conversion
severity: Medium
files_to_modify:
  - path: app/demo/page.tsx
    change_type: edit
    description: Redirect /demo to the canonical lead route (per founder decision, Section 10)
  - path: app/demo/demo-client.tsx
    change_type: delete
    description: Remove duplicate client once redirect lands (if /request-access is canonical)
implementation_steps:
  - step: Pending the canonical-route decision, make the non-canonical route redirect.
    code_diff: |
      // app/demo/page.tsx  (if /request-access is canonical)
      import { redirect } from 'next/navigation';
      export default function DemoPage() { redirect('/request-access'); }
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required:
  - none
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('/demo redirects to canonical lead route', async ({ page }) => {
      await page.goto('/demo');
      await expect(page).toHaveURL(/\/request-access$/);
      await expect(page.getByTestId('ra-submit')).toBeVisible();
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Confirm /demo lands on the single canonical lead form
acceptance_criteria:
  - Only one lead-capture form is reachable; the other route redirects
rollback_plan: git revert
effort_minutes: 20
confidence: high
```

### REM-007 — Skip-to-content link (ALREADY FIXED)

```yaml
finding_id: REM-007
title: Skip-to-content link
category: Accessibility
severity: High
files_to_modify:
  - path: app/layout.tsx
    change_type: edit
    description: DONE 2026-06-12 — <a class="skip-link" href="#main-content"> added; <main id="main-content">
  - path: app/globals.css
    change_type: edit
    description: DONE 2026-06-12 — .skip-link styles added
implementation_steps:
  - step: Verify the fix shipped; no further action.
    code_diff: |
      # rg -n "skip-link|#main-content" app/layout.tsx app/globals.css
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('skip link focuses first', async ({ page }) => {
      await page.goto('/');
      await page.keyboard.press('Tab');
      await expect(page.getByRole('link', { name: /skip to main content/i })).toBeFocused();
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Tab once on the homepage; confirm the skip link appears and jumps to content
acceptance_criteria:
  - First Tab reveals a visible skip link targeting #main-content
rollback_plan: git revert commit caef0aa
effort_minutes: 0
confidence: high
```

### REM-008 — Visible focus outline (ALREADY FIXED)

```yaml
finding_id: REM-008
title: Global :focus-visible outline
category: Accessibility
severity: Medium
files_to_modify:
  - path: app/globals.css
    change_type: edit
    description: DONE 2026-06-12 — :focus-visible outline using hsl(var(--ring)); :focus:not(:focus-visible) cleared
implementation_steps:
  - step: Verify; no further action.
    code_diff: |
      # rg -n "focus-visible" app/globals.css
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('focusable controls show outline', async ({ page }) => {
      await page.goto('/');
      await page.keyboard.press('Tab');
      const outline = await page.evaluate(() =>
        getComputedStyle(document.activeElement!).outlineStyle);
      expect(outline).not.toBe('none');
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Tab through nav; confirm a gold outline is visible on each control
acceptance_criteria:
  - Keyboard focus shows a visible outline; mouse focus does not
rollback_plan: git revert commit caef0aa
effort_minutes: 0
confidence: high
```

### REM-009 / REM-010 / REM-011 / REM-012 / REM-013 / REM-022 — Verified false positives (no code)

```yaml
finding_id: REM-009..REM-013, REM-022
title: Confirmed false positives — document and close
category: Accessibility/SEO
severity: High..Low
files_to_modify: []
implementation_steps:
  - step: REM-009 Request Access labels — VERIFIED present.
    code_diff: |
      # rg -n "htmlFor=\"lc-" components/forms/LeadCaptureForm.tsx  (6 labelled fields)
  - step: REM-010 FAQ accordion — VERIFIED accessible (aria-expanded toggling button + revealed panel).
    code_diff: |
      # rg -n "aria-expanded" components/faq-accordion.tsx
  - step: REM-011 Cookie banner — VERIFIED Accept all / Decline non-essential / Manage preferences + modal.
    code_diff: |
      # rg -n "Decline non-essential|Manage preferences" components/cookie-banner.tsx
  - step: REM-012 Viewport — Next.js 15 emits width=device-width by default; add explicit export only if customizing.
    code_diff: |
      // OPTIONAL app/layout.tsx
      export const viewport = { width: 'device-width', initialScale: 1 };
  - step: REM-013 Alt text — no <img> tags in repo; next/image + inline SVG used.
    code_diff: |
      # rg -n "<img" app components   (expect zero)
  - step: REM-022 JSON-LD — VERIFIED SoftwareApplication + Organization schema in layout.
    code_diff: |
      # rg -n "application/ld\\+json" app/layout.tsx
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  manual_qa_steps:
    - Spot-check each in the PR description; close as not-a-defect
acceptance_criteria:
  - Each item documented as false positive with grep evidence in the PR body
rollback_plan: n/a
effort_minutes: 20
confidence: high
```

### REM-014 — `aria-hidden` decorative numerals/symbols

```yaml
finding_id: REM-014
title: Hide decorative numerals/symbols from AT
category: Accessibility
severity: Low
files_to_modify:
  - path: LIKELY components/sections/feature-tiles.tsx
    change_type: edit
    description: Wrap step numerals (e.g. "01") in <span aria-hidden="true">
  - path: LIKELY components/sections/marketplace-join.tsx
    change_type: edit
    description: Same for step markers
implementation_steps:
  - step: Run REM-014 grep. For each plain-text numeral/symbol that is purely decorative, add aria-hidden.
    code_diff: |
      - <span className="step-num">01</span>
      + <span className="step-num" aria-hidden="true">01</span>
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('decorative numerals are aria-hidden', async ({ page }) => {
      await page.goto('/');
      const visibleNumerals = page.locator('text=/^0[0-9]$/').filter({
        hasNot: page.locator('[aria-hidden="true"]') });
      await expect(visibleNumerals).toHaveCount(0);
    });
  unit_rtl: |
    // covered by e2e
  manual_qa_steps:
    - Run a screen reader over the homepage feature steps; confirm numerals are not announced
acceptance_criteria:
  - All purely decorative numerals/symbols carry aria-hidden="true"
rollback_plan: git revert
effort_minutes: 20
confidence: medium
```

### REM-015 — Color-contrast remediation (verify-first)

```yaml
finding_id: REM-015
title: Fix WCAG AA contrast failures
category: Accessibility
severity: Medium
files_to_modify:
  - path: LIKELY app/globals.css
    change_type: edit
    description: Adjust low-contrast token values flagged by axe (e.g. offwhite/40 on navy)
implementation_steps:
  - step: Run axe (Section 3) and fix ONLY the selectors it flags; do not blanket-change the palette.
    code_diff: |
      # Example if body copy at /50 fails: raise to /70 on the failing selector
      - text-offwhite/40
      + text-offwhite/70
dependencies_to_install:
  - package: "@axe-core/cli"
    version: "^4.10.0"
    why: Runtime contrast/a11y audit (dev dependency only)
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import AxeBuilder from '@axe-core/playwright';
    import { test, expect } from '@playwright/test';
    test('no contrast violations on home', async ({ page }) => {
      await page.goto('/');
      const r = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
      const contrast = r.violations.filter(v => v.id === 'color-contrast');
      expect(contrast).toEqual([]);
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Re-run axe after the change; confirm zero color-contrast violations
acceptance_criteria:
  - axe reports zero color-contrast violations on audited routes
rollback_plan: git revert
effort_minutes: 60
confidence: low
```

### REM-016 — Target size (WCAG 2.2 2.5.8, 24×24)

```yaml
finding_id: REM-016
title: Ensure 24x24 minimum target size
category: Accessibility
severity: Medium
files_to_modify:
  - path: LIKELY components/navigation.tsx
    change_type: edit
    description: Pad icon-only buttons to >=24x24 (44x44 best practice)
  - path: LIKELY components/footer.tsx
    change_type: edit
    description: Same for footer icon links
implementation_steps:
  - step: Measure flagged controls; add logical padding to reach the threshold.
    code_diff: |
      - className="p-1"
      + className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2"
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('nav icon buttons meet 24px target', async ({ page }) => {
      await page.goto('/');
      for (const b of await page.getByRole('button').all()) {
        const box = await b.boundingBox();
        if (box) expect(Math.min(box.width, box.height)).toBeGreaterThanOrEqual(24);
      }
    });
  unit_rtl: |
    // covered by e2e
  manual_qa_steps:
    - Inspect nav/footer controls on mobile; confirm comfortable tap targets
acceptance_criteria:
  - All interactive targets are >= 24x24 CSS px (44x44 where feasible)
rollback_plan: git revert
effort_minutes: 40
confidence: low
```

### REM-017 — Inline form validation feedback

```yaml
finding_id: REM-017
title: Add accessible per-field validation
category: Conversion/UX
severity: Medium
files_to_modify:
  - path: components/forms/LeadCaptureForm.tsx
    change_type: edit
    description: Add aria-invalid + role="alert" messages per field
  - path: app/login/login-client.tsx
    change_type: edit
    description: Ensure the error <p> uses role="alert" (already present) and aria-describedby
implementation_steps:
  - step: Wire react-hook-form + zod for field-level errors (RHF/zod already in repo for dashboard).
    code_diff: |
      <input id="lc-email" aria-invalid={!!errors.workEmail}
        aria-describedby={errors.workEmail ? 'lc-email-err' : undefined} ... />
      {errors.workEmail && (
        <p id="lc-email-err" role="alert" className="text-destructive text-xs">
          {errors.workEmail.message}
        </p>
      )}
dependencies_to_install:
  - package: "react-hook-form"
    version: "^7.53.0"
    why: Field-level validation state (already used in dashboard; reuse)
  - package: "@hookform/resolvers"
    version: "^3.9.0"
    why: Zod resolver bridge
  - package: "zod"
    version: "^3.23.0"
    why: Schema validation (already in repo)
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions:
  - selector: data-testid="ra-email-error"
    location: components/forms/LeadCaptureForm.tsx
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('shows email error on invalid submit', async ({ page }) => {
      await page.goto('/request-access');
      await page.getByTestId('ra-email').fill('not-an-email');
      await page.getByTestId('ra-submit').click();
      await expect(page.getByTestId('ra-email-error')).toBeVisible();
    });
  unit_rtl: |
    import { render, screen, fireEvent } from '@testing-library/react';
    import LeadCaptureForm from '@/components/forms/LeadCaptureForm';
    test('blocks empty submit', () => {
      render(<LeadCaptureForm />);
      fireEvent.click(screen.getByRole('button', { name: /request access/i }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  manual_qa_steps:
    - Submit the lead form with bad email; confirm an accessible inline error
acceptance_criteria:
  - Invalid fields set aria-invalid and render a role="alert" message
rollback_plan: git revert
effort_minutes: 90
confidence: medium
```

### REM-018 — Add `data-testid` to critical paths

```yaml
finding_id: REM-018
title: Instrument data-testid for E2E
category: Testability
severity: High
files_to_modify:
  - path: app/login/login-client.tsx
    change_type: edit
    description: Add login-email, login-submit
  - path: components/forms/LeadCaptureForm.tsx
    change_type: edit
    description: Add ra-name, ra-email, ra-org, ra-role, ra-region, ra-submit
  - path: components/navigation.tsx
    change_type: edit
    description: Add nav-signin, nav-request-access
implementation_steps:
  - step: Add stable kebab-case, scope-prefixed testids (see Section 7).
    code_diff: |
      <input id="email" data-testid="login-email" type="email" ... />
      <button type="submit" data-testid="login-submit"> ... </button>
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions:
  - selector: data-testid="login-email"
    location: app/login/login-client.tsx
  - selector: data-testid="login-submit"
    location: app/login/login-client.tsx
  - selector: data-testid="ra-submit"
    location: components/forms/LeadCaptureForm.tsx
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('critical testids exist', async ({ page }) => {
      await page.goto('/login');
      await expect(page.getByTestId('login-email')).toBeVisible();
      await page.goto('/request-access');
      await expect(page.getByTestId('ra-submit')).toBeVisible();
    });
  unit_rtl: |
    // covered by e2e
  manual_qa_steps:
    - Inspect DOM; confirm testids present on the listed controls
acceptance_criteria:
  - All Section 7 critical-path testids are present and stable
rollback_plan: git revert (additive attributes only)
effort_minutes: 45
confidence: high
```

### REM-019 — Optimize hero image / lazy loading

```yaml
finding_id: REM-019
title: Migrate hero to next/image, lazy-load below-fold
category: Performance
severity: Medium
files_to_modify:
  - path: LIKELY components/sections/hero.tsx
    change_type: edit
    description: Replace raw <img>/background with next/image priority for LCP
implementation_steps:
  - step: Use next/image with priority for the hero (LCP) and default lazy for below-fold media.
    code_diff: |
      import Image from 'next/image';
      <Image src="/hero.webp" alt="" priority fill sizes="100vw"
        style={{ objectFit: 'cover' }} />
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('hero uses optimized image', async ({ page }) => {
      await page.goto('/');
      const img = page.locator('img').first();
      await expect(img).toHaveAttribute('src', /\/_next\/image|\.webp/);
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - Run PageSpeed Insights; confirm LCP image is served via next/image
acceptance_criteria:
  - Hero served through next/image with priority; below-fold media lazy-loaded
rollback_plan: git revert
effort_minutes: 60
confidence: medium
```

### REM-020 — Analytics event instrumentation

```yaml
finding_id: REM-020
title: Instrument consent-gated analytics events
category: Analytics
severity: High
files_to_modify:
  - path: lib/analytics.ts
    change_type: edit
    description: Add a typed track() that no-ops without "all" consent (see Section 8)
  - path: components/navigation.tsx
    change_type: edit
    description: Fire signup_click on Request Access / Sign In
  - path: components/forms/LeadCaptureForm.tsx
    change_type: edit
    description: Fire signup_success on successful submit
implementation_steps:
  - step: Add the typed track() reusing the existing hasAnalyticsConsent() gate.
    code_diff: |
      // lib/analytics.ts
      export function track(e: AnalyticsEvent) {
        if (!hasAnalyticsConsent()) return;
        window.gtag?.('event', e.name, e.props as Record<string, unknown>);
      }
  - step: Call track at interaction points.
    code_diff: |
      onClick={() => track({ name: 'signup_click',
        props: { source: 'header', sessionId: sid, page: '/', elementId: 'nav-request-access' } })}
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('signup_click fires after consent', async ({ page }) => {
      const events: string[] = [];
      await page.exposeFunction('__push', (n: string) => events.push(n));
      await page.addInitScript(() => {
        (window as any).gtag = (_t: string, n: string) => (window as any).__push(n);
      });
      await page.goto('/');
      await page.getByRole('button', { name: /accept all/i }).click();
      await page.getByTestId('nav-request-access').click();
      expect(events).toContain('signup_click');
    });
  unit_rtl: |
    import { track } from '@/lib/analytics';
    test('track no-ops without consent', () => {
      const spy = jest.fn(); (window as any).gtag = spy;
      track({ name: 'create_project_start', props: { sessionId: 's', page: '/', elementId: 'x' } });
      expect(spy).not.toHaveBeenCalled();
    });
  manual_qa_steps:
    - Accept cookies, click CTAs, confirm events in GA4 DebugView
acceptance_criteria:
  - Events fire only after "all" consent; types match Section 8
rollback_plan: git revert
effort_minutes: 90
confidence: high
```

### REM-021 — Server-side magic-byte upload validation (BACKEND-FLAGGED)

```yaml
finding_id: REM-021
title: Validate upload content by magic bytes server-side
category: Security
severity: High
files_to_modify:
  - path: app/actions/projects/upload-document.ts
    change_type: edit
    description: Verify real file type from buffer before storing; reject mismatches
implementation_steps:
  - step: Read the incoming bytes and confirm the sniffed type is in an allowlist before upload.
    code_diff: |
      import { fileTypeFromBuffer } from 'file-type';
      const buf = Buffer.from(await file.arrayBuffer());
      const ft = await fileTypeFromBuffer(buf);
      const ALLOW = new Set(['application/pdf', 'image/png', 'image/jpeg']);
      if (!ft || !ALLOW.has(ft.mime)) {
        return { ok: false, error: 'Unsupported or mismatched file type' };
      }
dependencies_to_install:
  - package: "file-type"
    version: "^19.5.0"
    why: Magic-byte sniffing to prevent disguised uploads
env_vars_to_add: []
backend_changes_required:
  - Confirm Supabase Storage bucket MIME allowlist + RLS aligns with the server allowlist
  - Confirm max file size enforced both client and server
data_testid_additions: []
testing:
  e2e_playwright: |
    // Requires authenticated session + fixture files; run in the dashboard suite
    // Upload a .exe renamed to .pdf -> expect rejection toast
  unit_rtl: |
    import { fileTypeFromBuffer } from 'file-type';
    test('rejects spoofed pdf', async () => {
      const fake = Buffer.from('MZ'); // PE header
      const ft = await fileTypeFromBuffer(fake);
      expect(ft?.mime).not.toBe('application/pdf');
    });
  manual_qa_steps:
    - Rename a binary to .pdf and attempt upload; confirm server rejects it
acceptance_criteria:
  - Uploads whose sniffed type is not in the allowlist are rejected before storage
rollback_plan: git revert; feature is server-side, no data migration
effort_minutes: 60
confidence: medium
```

### REM-023 — Arabic locale / RTL (EPIC — scope, do not rush)

```yaml
finding_id: REM-023
title: Introduce next-intl Arabic locale with RTL
category: i18n
severity: Medium
files_to_modify:
  - path: middleware.ts
    change_type: edit
    description: Add next-intl locale routing (en default, ar)
  - path: app/[locale]/layout.tsx
    change_type: create
    description: Set <html lang dir> per locale; wrap NextIntlClientProvider
  - path: messages/en.json, messages/ar.json
    change_type: create
    description: Translation catalogs
implementation_steps:
  - step: This is a multi-day epic. Gate behind a founder decision (Section 10) before starting.
    code_diff: |
      # Do NOT ship a half-translated /ar. Either complete the catalog or keep /ar removed
      # from the FAQ/nav until ready. Use logical CSS properties throughout for RTL.
dependencies_to_install:
  - package: "next-intl"
    version: "^3.20.0"
    why: App Router i18n routing + RTL
env_vars_to_add: []
backend_changes_required:
  - none (content only)
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('ar sets rtl', async ({ page }) => {
      await page.goto('/ar');
      await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    });
  unit_rtl: |
    // catalog completeness checked via a script comparing en/ar keys
  manual_qa_steps:
    - Visit /ar; confirm full translation and RTL mirroring
acceptance_criteria:
  - /ar renders dir="rtl", fully translated, no English fallback leakage
rollback_plan: git revert; remove locale from middleware matcher
effort_minutes: 480
confidence: medium
```

### REM-024 — ARIA labels on icon-only buttons

```yaml
finding_id: REM-024
title: Label icon-only controls
category: Accessibility
severity: Medium
files_to_modify:
  - path: LIKELY components/navigation.tsx
    change_type: edit
    description: Add aria-label to hamburger/close/icon controls lacking text
implementation_steps:
  - step: Run REM-024 grep; add aria-label to any icon-only button without an accessible name.
    code_diff: |
      - <button onClick={toggle}><Menu /></button>
      + <button onClick={toggle} aria-label="Open menu"><Menu aria-hidden="true" /></button>
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import AxeBuilder from '@axe-core/playwright';
    import { test, expect } from '@playwright/test';
    test('no button-name violations', async ({ page }) => {
      await page.goto('/');
      const r = await new AxeBuilder({ page }).analyze();
      expect(r.violations.filter(v => v.id === 'button-name')).toEqual([]);
    });
  unit_rtl: |
    // covered by e2e
  manual_qa_steps:
    - Screen-reader the nav; confirm each icon control announces a name
acceptance_criteria:
  - axe reports zero button-name/link-name violations
rollback_plan: git revert
effort_minutes: 30
confidence: low
```

### REM-025 — SEO meta completeness

```yaml
finding_id: REM-025
title: Canonical + robots strategy
category: SEO
severity: Low
files_to_modify:
  - path: app/layout.tsx
    change_type: edit
    description: Add metadata.alternates.canonical and a robots policy
  - path: app/robots.ts
    change_type: create
    description: Emit robots.txt allowing production, disallowing previews
implementation_steps:
  - step: Add canonical + robots; keep previews noindex (already handled in next.config for headers).
    code_diff: |
      // app/layout.tsx metadata
      alternates: { canonical: 'https://www.baytyai.com' },
      robots: process.env.VERCEL_ENV === 'production'
        ? { index: true, follow: true } : { index: false, follow: false },
dependencies_to_install: []
env_vars_to_add: []
backend_changes_required: [none]
data_testid_additions: []
testing:
  e2e_playwright: |
    import { test, expect } from '@playwright/test';
    test('canonical present', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        'href', 'https://www.baytyai.com');
    });
  unit_rtl: |
    // not applicable
  manual_qa_steps:
    - View source; confirm canonical + robots meta
acceptance_criteria:
  - Production emits canonical + index; previews emit noindex
rollback_plan: git revert
effort_minutes: 30
confidence: medium
```

## 5. PR Sequencing Strategy

Group by cohesion and dependency. Trust-blockers first (within 24h), accessibility false-positive closeout is cheap and de-risks the audit narrative for investors.

| PR # | Title | Findings | Branch | Est. Time | Dependencies |
|------|-------|----------|--------|-----------|--------------|
| 1 | fix: auth unification + share image (launch trust) | REM-001, REM-002, REM-005 | `fix/auth-and-og` | 1.5h | none |
| 2 | fix: route + legal/about trust cleanup | REM-003, REM-004, REM-006 | `fix/trust-cleanup` | 1.5h | none |
| 3 | chore: a11y closeout + verified false positives | REM-007, REM-008, REM-009–013, REM-014, REM-022, REM-024 | `chore/a11y-closeout` | 1.5h | none |
| 4 | test: data-testid instrumentation | REM-018 | `test/testids` | 0.75h | none |
| 5 | feat: analytics events | REM-020 | `feat/analytics-events` | 1.5h | PR4 (testids) |
| 6 | fix: forms validation + perf | REM-017, REM-019, REM-016, REM-015 | `fix/forms-and-perf` | 4h | PR4 (testids) |
| 7 | sec: upload magic-byte validation | REM-021 | `sec/upload-validation` | 1h | none |
| (epic) | feat: Arabic i18n + RTL | REM-023 | `feat/i18n-ar` | 8h | founder go/no-go |

Rationale: PR1 removes the two investor-visible defects (confusing auth + blank social cards). PR2 clears remaining trust questions pending founder input. PR3 converts the audit's long a11y list into a documented, mostly-already-correct closeout. PR4 must precede PR5/PR6 because their tests select by testid. The i18n epic is deliberately isolated and gated.

## 6. Claude Code Execution Instructions

```text
You are executing the BaytyAI remediation spec at [SPEC_FILE_PATH] (./BAYTYAI_REMEDIATION_SPEC.md).

Work PR-by-PR in the order defined in Section 5. For EACH PR:
1. Create a branch using the exact name in the Section 5 table (e.g. fix/auth-and-og).
2. For every finding in that PR, FIRST run its Section 3 verification block. If the
   result says SKIP (false positive), do not write code — record the grep evidence in
   the PR description under "Verified false positives" and move on.
3. For confirmed findings, apply the Section 4 implementation_steps exactly. Respect
   the Section 7 conventions (kebab-case scope-prefixed data-testid, logical CSS
   properties, Tailwind v4 @theme, shadcn primitives, no emoji, ASCII only).
4. Add the Playwright e2e and RTL unit tests from each finding. Every Playwright test
   must run on desktop AND devices['iPhone 13'] and assert toBeVisible(), not just URL.
5. Before committing run, in order: pnpm lint, pnpm build, pnpm test. Do not commit if
   any fails; fix forward.
6. Use Conventional Commits (fix:/feat:/chore:/test:/sec: with a scope, e.g.
   "fix(auth): redirect /sign-in to /login"). One logical commit per finding is fine.
7. Push the branch and open a PR using this template:

   ## Summary
   <what changed and why, referencing REM-IDs>
   ## Findings addressed
   - REM-XXX: <one line> (confirmed)
   - REM-YYY: <one line> (verified false positive — grep evidence)
   ## Tests
   - <playwright + rtl added>
   ## Acceptance criteria
   - [ ] <copied from spec, checked>
   ## Rollback
   <git revert SHA / flag>

8. After opening each PR, STOP and ask me to review the Vercel preview URL before
   starting the next PR. Expect a preview deploy per branch; production deploys only
   on merge to main.
9. Do NOT touch backend/database migrations. For REM-021, implement the server-action
   code but list any Supabase bucket/RLS changes in the PR body for me to apply.
10. Do NOT start the i18n epic (REM-023) until I explicitly approve it.

Begin with PR #1. Run the verification protocol first.
```

## 7. Global Engineering Conventions

- **data-testid:** kebab-case, scope-prefixed. `login-email`, `login-submit`, `ra-name`, `ra-email`, `ra-submit`, `nav-request-access`, `nav-signin`, `pricing-toggle`, `doc-upload`, `faq-item-0`.
- **Commits:** Conventional Commits with scope — `fix(auth): ...`, `feat(i18n): ...`, `chore(a11y): ...`, `test(e2e): ...`, `sec(upload): ...`. ASCII only, no emoji.
- **Branches:** `fix/<scope>`, `feat/<scope>`, `chore/<scope>`, `test/<scope>`, `sec/<scope>`.
- **App Router paths:** `app/<route>/page.tsx`, `app/<route>/layout.tsx`, route-handlers at `app/<route>/route.ts`, shared UI in `components/`, logic in `lib/`. Verify with `rg` before assuming a path marked `LIKELY:`.
- **Tailwind v4:** config-less; use the `@theme` directive and CSS variables in `app/globals.css`. No `tailwind.config.js` patterns.
- **RTL safety:** logical properties only where direction matters — `margin-inline-start`, `padding-block-end`, `inset-inline-start` — never `margin-left`/`padding-bottom` for directional layout.
- **shadcn/ui:** prefer existing primitives (`Button`, `Input`, `Select`, `FormLabel`) over hand-rolled markup; Radix under shadcn already provides correct ARIA — do not reinvent.
- **Accessibility:** rely on Radix for menus/dialogs/switches; only add `aria-*` for custom or icon-only controls.
- **TypeScript:** strict; no `any` in new code except where bridging untyped globals (e.g. `window.gtag`), and isolate those casts.

## 8. Analytics Event Specification

Provider decision (founder, Section 10): **GA4 (already wired, consent-gated) for launch**, with **PostHog recommended** as a fast follow for GCC data-residency and product analytics. Vercel Analytics may run in parallel for Web Vitals. The client lives in `lib/analytics.ts` and is **consent-gated** via the existing `hasAnalyticsConsent()` — `track()` is a no-op until the user accepts "all" cookies.

```typescript
// lib/analytics.ts
type BaseProps = { userId?: string; sessionId: string; page: string; elementId: string };

export type AnalyticsEvent =
  | { name: 'signup_click'; props: BaseProps & { source: 'header' | 'pricing' | 'hero' } }
  | { name: 'signup_success'; props: BaseProps & { userId: string } }
  | { name: 'create_project_start'; props: BaseProps }
  | { name: 'create_project_submit'; props: BaseProps & { projectId: string } }
  | { name: 'file_upload_start'; props: BaseProps & { fileType: string; sizeBytes: number } }
  | { name: 'file_upload_success'; props: BaseProps & { fileId: string } }
  | { name: 'file_upload_error'; props: BaseProps & { reason: string } };

export function track(e: AnalyticsEvent): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  window.gtag?.('event', e.name, e.props as Record<string, unknown>);
}
```

Instrumentation points: `signup_click` on header/hero/pricing CTAs (REM-020); `signup_success` on lead-form success; `create_project_*` and `file_upload_*` in the dashboard wizard and upload action. `sessionId` is a per-tab UUID stored in `sessionStorage`; `userId` is the Supabase user id when authenticated.

## 9. Out of Scope

- **REM-002 / A2:F-001 ("no login/signup entry", "blank login")** — false positive; `/login` renders a working client form and nav exposes Sign In + Request Access. No code beyond testids.
- **REM-009 (form labels)** — false positive; `LeadCaptureForm.tsx` labels all six fields with `htmlFor`/`id`.
- **REM-010 (FAQ hidden)** — false positive; accessible `aria-expanded` accordion.
- **REM-011 (cookie decline)** — false positive; banner has Accept all / Decline non-essential / Manage preferences + modal.
- **REM-012 (viewport)** — false positive; Next.js 15 emits the viewport meta by default.
- **REM-013 (alt text)** — false positive; repo has no `<img>` tags.
- **REM-022 (JSON-LD)** — false positive; `SoftwareApplication` + `Organization` schema already in `app/layout.tsx`.
- **Password-based login (A3:F-001 suggested fix)** — explicitly rejected; the product is passwordless (Supabase email OTP/magic link). Adding password fields would break auth.
- **Lighthouse score targets (58/72/45/80 and 75/70/80/85)** — unverified placeholders; do not optimize to a number. Record a real PageSpeed baseline after PR #1.
- **Database migrations / RLS edits** — not executable here; REM-021 backend items are flagged for the founder to apply in Supabase.

## 10. Open Questions for the Founder

- **Canonical auth route:** confirm `/login` is canonical and `/sign-in` should permanently redirect (REM-001). (Recommended: yes.)
- **Canonical lead route:** `/request-access` or `/demo`? The other will redirect (REM-006). (Recommended: `/request-access`.)
- **Draft/legal banner:** is any on-page draft/disclaimer banner intentional? Keep for staging only, or remove entirely (REM-003)?
- **About content:** provide real founder/team bios + photos, or remove the team section until ready (REM-004)?
- **Analytics provider:** GA4-only at launch, or add PostHog now for GCC residency (Section 8, REM-020)?
- **Arabic locale timing:** ship full `/ar` now (8h epic), or keep it removed from nav/FAQ until the catalog is complete (REM-023)?
- **Pricing conversion:** Stripe Checkout for Starter/Professional, or lead-form for all tiers? (Affects future analytics events, not this batch.)
- **Upload allowlist:** confirm accepted document types (PDF/PNG/JPEG assumed) for the magic-byte allowlist (REM-021).

## Appendix A — Source Audit Traceability Matrix

| REM-ID | Audit 1 (deep research) | Audit 2 (automated) | Audit 3 (manual) | Resolution |
|--------|-------------------------|---------------------|------------------|------------|
| REM-001 | split /login vs /sign-in | F-001 | F-001 | Fix (redirect) |
| REM-002 | blank /login | F-001 | F-001 | False positive + testids |
| REM-003 | legal-banner leak | — | — | Verify then fix |
| REM-004 | founder placeholder | — | — | Verify then fix |
| REM-005 | missing OG image | — | — | Fix |
| REM-006 | /demo duplicate | — | — | Fix (redirect) |
| REM-007 | — | — | F-004 | Already fixed |
| REM-008 | — | aria/contrast | F-007 | Already fixed |
| REM-009 | — | — | F-002 | False positive |
| REM-010 | FAQ accordion | — | F-003 | False positive |
| REM-011 | cookie banner | — | F-006 | False positive |
| REM-012 | — | meta | F-008 | False positive |
| REM-013 | — | — | F-009 | False positive |
| REM-014 | decorative | — | F-005 | Verify then fix |
| REM-015 | — | contrast | — | Verify then fix |
| REM-016 | touch targets | F-008 | touch | Verify then fix |
| REM-017 | validation | F-009 | forms | Fix |
| REM-018 | — | F-002 | — | Fix |
| REM-019 | assets | F-003 | F-010 | Verify then fix |
| REM-020 | analytics | F-007 | — | Fix (events) |
| REM-021 | upload security | — | — | Fix (flag backend) |
| REM-022 | json-ld | — | — | False positive |
| REM-023 | i18n/Arabic | — | — | Epic (gated) |
| REM-024 | — | F-004 | — | Verify then fix |
| REM-025 | — | F-006 (seo:45) | — | Fix (low) |

## Appendix B — Estimated Total Effort

Assumes one senior frontend engineer working with Claude Code at 6 productive hours/day.

| PR | Findings | Hours |
|----|----------|-------|
| 1 | REM-001, 002, 005 | 1.5 |
| 2 | REM-003, 004, 006 | 1.5 |
| 3 | REM-007, 008, 009–013, 014, 022, 024 | 1.5 |
| 4 | REM-018 | 0.75 |
| 5 | REM-020 | 1.5 |
| 6 | REM-017, 019, 016, 015 | 4.0 |
| 7 | REM-021 | 1.0 |
| Subtotal (launch batch) | | **11.75 h (~2 days)** |
| Epic | REM-023 i18n/RTL | 8.0 |
| **Total incl. epic** | | **~19.75 h (~3.5 days)** |

Add ~30% buffer for review cycles, verification false-positive triage, and a real PageSpeed baseline pass: **~26 productive hours (~4.5 days)** end-to-end.
