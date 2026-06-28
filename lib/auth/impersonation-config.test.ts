import { describe, it, expect } from 'vitest';

import {
  IMPERSONATION_ROLES,
  SEED_USERS,
  DEMO_ORG,
  isImpersonationRole,
  seedEmailFor,
} from './impersonation-config';

describe('impersonation-config', () => {
  it('covers exactly the five org roles', () => {
    expect([...IMPERSONATION_ROLES]).toEqual(['owner', 'admin', 'manager', 'member', 'viewer']);
  });

  it('generates the documented email pattern', () => {
    expect(seedEmailFor('owner')).toBe('impersonation+owner@baytyai.com');
    expect(seedEmailFor('viewer')).toBe('impersonation+viewer@baytyai.com');
  });

  it('has one seed user per role with matching email', () => {
    expect(SEED_USERS).toHaveLength(5);
    for (const u of SEED_USERS) {
      expect(u.email).toBe(seedEmailFor(u.role));
      expect(u.fullName.length).toBeGreaterThan(0);
    }
  });

  it('provisions the demo org on the enterprise tier', () => {
    expect(DEMO_ORG.tier).toBe('enterprise');
    expect(DEMO_ORG.slug).toBe('impersonation-demo-org');
  });

  it('isImpersonationRole accepts valid roles and rejects others', () => {
    expect(isImpersonationRole('manager')).toBe(true);
    expect(isImpersonationRole('superadmin')).toBe(false);
    expect(isImpersonationRole(null)).toBe(false);
    expect(isImpersonationRole(123)).toBe(false);
  });
});
