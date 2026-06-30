/**
 * Single source of truth for the 6-role access model.
 *
 * Two orthogonal axes:
 *   - platformRole: 'admin' (runs Bayty) | 'user' (everyone else)
 *   - stakeholderType: the org's business type
 *
 * `can()` returns one of:
 *   - 'allow'             → perform the action directly
 *   - 'requires_approval' → create an approvals row (status 'pending') instead
 *   - 'deny'              → reject
 *
 * This matrix MUST mirror the RLS policies in
 * supabase/migrations/006_rbac_marketplace.sql. The table-driven test in
 * lib/auth/permissions.test.ts pins every cell.
 */

export type StakeholderType = 'client' | 'consultant' | 'contractor' | 'subcontractor' | 'supplier';

export type PlatformRole = 'admin' | 'user';

export type Action =
  | 'verification.decide'
  | 'inquiry.post'
  | 'quotation.submit'
  | 'quotation.award'
  | 'project.create'
  | 'document.upload'
  | 'document.approve'
  | 'marketplace.browse'
  | 'marketplace.appear'
  | 'selection.manage'
  | 'selection.evaluate';

export type Decision = 'allow' | 'requires_approval' | 'deny';

/**
 * Per-action rules for the five stakeholder types.
 * Platform admin ('admin') is handled separately: admin → 'allow' for everything.
 */
const MATRIX: Record<Action, Record<StakeholderType, Decision>> = {
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
  // Running a consultant-selection process (intake, criteria, award) is a
  // client/owner activity; consultants taking part cannot manage it.
  'selection.manage': {
    client: 'allow',
    consultant: 'deny',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
  // Submitting evaluation scores — done by client-side panel members.
  'selection.evaluate': {
    client: 'allow',
    consultant: 'deny',
    contractor: 'requires_approval',
    subcontractor: 'deny',
    supplier: 'deny',
  },
};

/**
 * Resolve a permission. Platform admins bypass the stakeholder matrix.
 * The server action is responsible for re-deriving (platformRole, stakeholderType)
 * from the session — never trust client-supplied values.
 */
export function can(
  platformRole: PlatformRole,
  stakeholderType: StakeholderType | null,
  action: Action,
): Decision {
  if (platformRole === 'admin') return 'allow';
  if (!stakeholderType) return 'deny';
  return MATRIX[action][stakeholderType];
}

export const ALL_ACTIONS = Object.keys(MATRIX) as Action[];
export const ALL_STAKEHOLDER_TYPES: StakeholderType[] = [
  'client',
  'consultant',
  'contractor',
  'subcontractor',
  'supplier',
];
