import { describe, expect, it } from 'vitest';

import { ALL_ACTIONS, ALL_STAKEHOLDER_TYPES, can } from './permissions';

import type { Action, Decision, StakeholderType } from './permissions';

// Pinned expectation matrix — mirrors the RLS intent in
// supabase/migrations/006_rbac_marketplace.sql. Any change here must be made in
// both places.
const EXPECTED: Record<Action, Record<StakeholderType, Decision>> = {
  'verification.decide': {
    client: 'deny',
    consultant: 'deny',
    contractor: 'deny',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  'inquiry.post': {
    client: 'allow',
    consultant: 'allow',
    contractor: 'allow',
    subcontractor: 'requires_approval',
    supplier: 'requires_approval',
  },
  'quotation.submit': {
    client: 'deny',
    consultant: 'allow',
    contractor: 'allow',
    subcontractor: 'allow',
    supplier: 'allow',
  },
  'quotation.award': {
    client: 'allow',
    consultant: 'requires_approval',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  'project.create': {
    client: 'allow',
    consultant: 'allow',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  'document.upload': {
    client: 'allow',
    consultant: 'allow',
    contractor: 'allow',
    subcontractor: 'allow',
    supplier: 'allow',
  },
  'document.approve': {
    client: 'allow',
    consultant: 'allow',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  'marketplace.browse': {
    client: 'allow',
    consultant: 'allow',
    contractor: 'allow',
    subcontractor: 'allow',
    supplier: 'allow',
  },
  'marketplace.appear': {
    client: 'deny',
    consultant: 'allow',
    contractor: 'allow',
    subcontractor: 'allow',
    supplier: 'allow',
  },
  'selection.manage': {
    client: 'allow',
    consultant: 'deny',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  'selection.evaluate': {
    client: 'allow',
    consultant: 'deny',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
};

describe('can() — 6-role permission matrix', () => {
  it('platform admin is allowed every action regardless of stakeholder type', () => {
    for (const action of ALL_ACTIONS) {
      expect(can('admin', null, action)).toBe('allow');
      for (const st of ALL_STAKEHOLDER_TYPES) {
        expect(can('admin', st, action)).toBe('allow');
      }
    }
  });

  it('a user with no stakeholder type is denied everything', () => {
    for (const action of ALL_ACTIONS) {
      expect(can('user', null, action)).toBe('deny');
    }
  });

  it('matches the pinned matrix for every (stakeholderType, action) cell', () => {
    for (const action of ALL_ACTIONS) {
      for (const st of ALL_STAKEHOLDER_TYPES) {
        expect(can('user', st, action)).toBe(EXPECTED[action][st]);
      }
    }
  });
});
