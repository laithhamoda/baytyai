import { describe, it, expect } from 'vitest';

import { ADMIN_EMAILS, isAllowlistedAdmin } from './admin-allowlist';

describe('admin-allowlist (Layer 2)', () => {
  it('allows the exact configured admin email', () => {
    expect(isAllowlistedAdmin('info@baytyai.com')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(isAllowlistedAdmin('INFO@BaytyAI.com')).toBe(true);
  });

  it('trims surrounding whitespace', () => {
    expect(isAllowlistedAdmin('  info@baytyai.com  ')).toBe(true);
  });

  it('denies a non-allowlisted email', () => {
    expect(isAllowlistedAdmin('attacker@evil.com')).toBe(false);
  });

  it('denies a look-alike subdomain', () => {
    expect(isAllowlistedAdmin('info@baytyai.com.evil.com')).toBe(false);
  });

  it.each([null, undefined, '', '   '])('denies empty/nullish value: %p', (value) => {
    expect(isAllowlistedAdmin(value as string | null | undefined)).toBe(false);
  });

  it('exposes exactly one allowlisted email', () => {
    expect(ADMIN_EMAILS).toEqual(['info@baytyai.com']);
  });
});
