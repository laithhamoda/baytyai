import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

// Route → minimum role required
const ROUTE_ROLE_MAP: Array<{ pattern: RegExp; role: string }> = [
  { pattern: /^\/dashboard\/settings\/members/, role: 'admin' },
  { pattern: /^\/dashboard\/settings\/billing/, role: 'owner' },
  { pattern: /^\/dashboard\/settings/, role: 'admin' },
  { pattern: /^\/admin/, role: 'admin' },
];

export function checkRouteRbac(
  request: NextRequest,
  orgRole: string | null,
  isSystemAdmin: boolean,
): NextResponse | null {
  if (isSystemAdmin) return null; // bypass for system admins
  const pathname = request.nextUrl.pathname;
  for (const { pattern, role } of ROUTE_ROLE_MAP) {
    if (!pattern.test(pathname)) continue;
    const RANK: Record<string, number> = {
      owner: 5,
      admin: 4,
      manager: 3,
      member: 2,
      viewer: 1,
    };
    if (!orgRole || (RANK[orgRole] ?? 0) < (RANK[role] ?? 0)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  return null;
}
