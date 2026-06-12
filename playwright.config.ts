import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config for the impersonation E2E suite (Phase 5).
 *
 * Requires a RUNNING app (local `pnpm dev` or a Vercel Preview URL) backed by a
 * real Supabase project with the seed users provisioned (`pnpm seed:impersonation`)
 * and these env vars present:
 *   - PLAYWRIGHT_BASE_URL            (default http://localhost:3000)
 *   - NEXT_PUBLIC_SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY      (setup mints the founder session)
 *   - IMPERSONATION_SECRET           (sent as x-impersonation-token)
 *   - NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION=true
 *
 * See docs/runbooks/impersonation.md.
 */
const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    // 1. Establish an authenticated founder session, saved to storage state.
    { name: 'setup', testMatch: /auth\.setup\.ts/ },
    // 2. The impersonation specs reuse the founder storage state.
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/founder.json',
      },
      dependencies: ['setup'],
    },
  ],
});
