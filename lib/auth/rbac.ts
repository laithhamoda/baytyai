import { NextResponse } from 'next/server';

import type { OrgRole } from '@/lib/types/tenancy';
import type { NextRequest } from 'next/server';

const ROLE_RANK: Record<OrgRole, number> = {
  owner: 5,
  admin: 4,
  manager: 3,
  member: 2,
  viewer: 1,
};

// Route pattern → minimum role required to access
const ROUTE_ROLE_MAP: Array<{ pattern: RegExp; role: OrgRole }> = [
  { pattern: /^\/dashboard\/settings\/billing/, role: 'owner' },
  { pattern: /^\/dashboard\/settings\/members/, role: 'admin' },
  { pattern: /^\/dashboard\/settings/, role: 'admin' },
  { pattern: /^\/admin/, role: 'admin' },
];

export function checkRouteRbac(
  request: NextRequest,
  orgRole: OrgRole | null,
  isSystemAdmin: boolean,
): NextResponse | null {
  if (isSystemAdmin) return null;

  const pathname = request.nextUrl.pathname;

  for (const { pattern, role } of ROUTE_ROLE_MAP) {
    if (!pattern.test(pathname)) continue;
    const userRank = orgRole ? (ROLE_RANK[orgRole] ?? 0) : 0;
    const minRank = ROLE_RANK[role];
    if (userRank < minRank) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return null;
}
