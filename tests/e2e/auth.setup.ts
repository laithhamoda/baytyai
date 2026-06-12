import { test as setup, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';

import { ADMIN_EMAILS } from '@/lib/auth/admin-allowlist';

/**
 * Founder authentication setup (Phase 5).
 *
 * Establishes a real, logged-in founder session and saves it to
 * `.auth/founder.json` for the impersonation specs to reuse.
 *
 * Mechanism: use the service-role key to ensure the founder auth user exists,
 * then generate a magic link and drive the browser through it — the same
 * magic-link click flow the app uses in production (Supabase verify →
 * /auth/callback → exchangeCodeForSession → session cookies).
 */
const FOUNDER_EMAIL = ADMIN_EMAILS[0];
const STORAGE = '.auth/founder.json';

setup('authenticate founder', async ({ page, baseURL }) => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  expect(url, 'NEXT_PUBLIC_SUPABASE_URL must be set').toBeTruthy();
  expect(serviceKey, 'SUPABASE_SERVICE_ROLE_KEY must be set').toBeTruthy();

  const admin = createClient(url!, serviceKey!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Ensure the founder user exists and is confirmed (idempotent).
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const exists = list?.users.some((u) => (u.email ?? '').toLowerCase() === FOUNDER_EMAIL);
  if (!exists) {
    await admin.auth.admin.createUser({
      email: FOUNDER_EMAIL,
      email_confirm: true,
      user_metadata: { full_name: 'Founder', role: 'admin' },
    });
  }

  // Generate a magic link that redirects back into the app's callback route.
  const { data: link, error } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: FOUNDER_EMAIL,
    options: { redirectTo: `${baseURL}/auth/callback?next=/account` },
  });
  expect(error, error?.message).toBeNull();
  expect(link?.properties?.action_link).toBeTruthy();

  // Click the link in a real browser context — sets the founder's session cookies.
  await page.goto(link!.properties!.action_link);
  await page.waitForURL(/\/account|\/dashboard/, { timeout: 15_000 });

  await page.context().storageState({ path: STORAGE });
});
