import { test, expect, request as playwrightRequest } from '@playwright/test';

import { IMPERSONATION_ROLES } from '@/lib/auth/impersonation-config';

/**
 * Impersonation E2E (Phase 5).
 *
 * Runs against a live app + real Supabase with seed users provisioned. The
 * `chromium` project supplies an authenticated founder storage state.
 *
 * Covers:
 *   - each role mints a session and lands in the dashboard
 *   - RBAC differs by role (owner reaches billing; viewer is redirected)
 *   - all four security layers: missing secret, wrong secret, bad role, and
 *     an UNAUTHENTICATED caller each get 404 (feature never revealed)
 */

const SECRET = process.env.IMPERSONATION_SECRET ?? '';
const ENDPOINT = '/api/admin/impersonate';

test.describe('impersonation — happy path (authenticated founder)', () => {
  test.skip(!SECRET, 'IMPERSONATION_SECRET not set');

  for (const role of IMPERSONATION_ROLES) {
    test(`mints a session for "${role}" and reaches the dashboard`, async ({ page }) => {
      const res = await page.request.post(ENDPOINT, {
        headers: { 'x-impersonation-token': SECRET },
        data: { role },
      });
      expect(res.status(), `POST ${role} should be 200`).toBe(200);

      // Cookies from the request are shared with the page context.
      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/dashboard/);
    });
  }
});

test.describe('impersonation — RBAC differs by role', () => {
  test.skip(!SECRET, 'IMPERSONATION_SECRET not set');

  test('owner can reach billing settings', async ({ page }) => {
    const res = await page.request.post(ENDPOINT, {
      headers: { 'x-impersonation-token': SECRET },
      data: { role: 'owner' },
    });
    expect(res.status()).toBe(200);
    await page.goto('/dashboard/settings/billing');
    await expect(page).toHaveURL(/\/dashboard\/settings\/billing/);
  });

  test('viewer is redirected away from billing settings', async ({ page }) => {
    const res = await page.request.post(ENDPOINT, {
      headers: { 'x-impersonation-token': SECRET },
      data: { role: 'viewer' },
    });
    expect(res.status()).toBe(200);
    await page.goto('/dashboard/settings/billing');
    // RBAC gate redirects insufficient roles back to /dashboard.
    await expect(page).not.toHaveURL(/\/settings\/billing/);
  });
});

test.describe('impersonation — security layers (authenticated founder)', () => {
  test('missing secret header → 404', async ({ page }) => {
    const res = await page.request.post(ENDPOINT, { data: { role: 'owner' } });
    expect(res.status()).toBe(404);
  });

  test('wrong secret → 404', async ({ page }) => {
    const res = await page.request.post(ENDPOINT, {
      headers: { 'x-impersonation-token': 'wrong-secret-value' },
      data: { role: 'owner' },
    });
    expect(res.status()).toBe(404);
  });

  test('invalid role → 404', async ({ page }) => {
    test.skip(!SECRET, 'IMPERSONATION_SECRET not set');
    const res = await page.request.post(ENDPOINT, {
      headers: { 'x-impersonation-token': SECRET },
      data: { role: 'superadmin' },
    });
    expect(res.status()).toBe(404);
  });
});

test.describe('impersonation — unauthenticated caller is rejected', () => {
  test('no founder session + valid secret → 404', async ({ baseURL }) => {
    // A brand-new context with NO storage state (not the founder).
    const ctx = await playwrightRequest.newContext({ baseURL });
    const res = await ctx.post(ENDPOINT, {
      headers: { 'x-impersonation-token': SECRET || 'anything' },
      data: { role: 'owner' },
    });
    expect(res.status()).toBe(404);
    await ctx.dispose();
  });
});
