import { describe, it, expect } from 'vitest';
import { isImpersonationEnvEnabled } from './impersonation-gate';

/**
 * Production lock-down verification (Phase 6).
 *
 * These tests encode the invariant that the impersonation feature is INERT
 * unless explicitly enabled in a non-production environment. They are the
 * machine-checkable counterpart to the runbook's "leave it unset in Production"
 * instruction.
 */
function env(overrides: Record<string, string | undefined>): NodeJS.ProcessEnv {
  return overrides as NodeJS.ProcessEnv;
}

describe('production lock-down', () => {
  it('is OFF in production even with the flag explicitly set', () => {
    expect(
      isImpersonationEnvEnabled(
        env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: 'true', NODE_ENV: 'production' }),
      ),
    ).toBe(false);
  });

  it('is OFF when the flag is unset (the default everywhere)', () => {
    expect(isImpersonationEnvEnabled(env({ NODE_ENV: 'production' }))).toBe(false);
    expect(isImpersonationEnvEnabled(env({ NODE_ENV: 'development' }))).toBe(false);
    expect(isImpersonationEnvEnabled(env({}))).toBe(false);
  });

  it('is OFF for truthy-but-not-"true" flag values', () => {
    for (const v of ['1', 'yes', 'TRUE', 'on']) {
      expect(
        isImpersonationEnvEnabled(
          env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: v, NODE_ENV: 'development' }),
        ),
      ).toBe(false);
    }
  });

  it('is ON only with the exact literal "true" AND a non-production env', () => {
    expect(
      isImpersonationEnvEnabled(
        env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: 'true', NODE_ENV: 'preview' }),
      ),
    ).toBe(true);
  });
});
