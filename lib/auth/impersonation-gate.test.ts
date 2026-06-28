import { describe, it, expect } from 'vitest';

import { isImpersonationEnvEnabled, isValidImpersonationToken } from './impersonation-gate';

function env(overrides: Record<string, string | undefined>): NodeJS.ProcessEnv {
  return overrides as NodeJS.ProcessEnv;
}

describe('Layer 1 — environment gate', () => {
  it('enabled when flag is true and NODE_ENV is not production', () => {
    expect(
      isImpersonationEnvEnabled(
        env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: 'true', NODE_ENV: 'development' }),
      ),
    ).toBe(true);
  });

  it('disabled in production even when the flag is true', () => {
    expect(
      isImpersonationEnvEnabled(
        env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: 'true', NODE_ENV: 'production' }),
      ),
    ).toBe(false);
  });

  it('disabled when the flag is unset', () => {
    expect(isImpersonationEnvEnabled(env({ NODE_ENV: 'development' }))).toBe(false);
  });

  it('disabled when the flag is any value other than the literal "true"', () => {
    expect(
      isImpersonationEnvEnabled(
        env({ NEXT_PUBLIC_ENABLE_ADMIN_IMPERSONATION: '1', NODE_ENV: 'development' }),
      ),
    ).toBe(false);
  });

  it('disabled in a preview-style env without the flag', () => {
    expect(isImpersonationEnvEnabled(env({ NODE_ENV: 'test' }))).toBe(false);
  });
});

describe('Layer 3 — shared-secret token', () => {
  const SECRET = 'a'.repeat(64); // 32 bytes hex-encoded

  it('accepts a matching token', () => {
    expect(isValidImpersonationToken(SECRET, SECRET)).toBe(true);
  });

  it('rejects a wrong token of equal length', () => {
    expect(isValidImpersonationToken('b'.repeat(64), SECRET)).toBe(false);
  });

  it('rejects a token of different length', () => {
    expect(isValidImpersonationToken('short', SECRET)).toBe(false);
  });

  it.each([null, undefined, ''])('rejects missing provided token: %p', (provided) => {
    expect(isValidImpersonationToken(provided, SECRET)).toBe(false);
  });

  it.each([null, undefined, ''])('rejects when expected secret is missing: %p', (expected) => {
    expect(isValidImpersonationToken(SECRET, expected)).toBe(false);
  });
});
