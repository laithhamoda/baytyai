import { NextResponse, type NextRequest } from 'next/server';

import { isImpersonationRole } from '@/lib/auth/impersonation-config';
import { performImpersonation } from '@/lib/auth/impersonation-core';
import { isImpersonationEnvEnabled } from '@/lib/auth/impersonation-gate';
import { siteUrl } from '@/lib/site-url';

/**
 * Dev/preview-only role-impersonation endpoint (Phase 4).
 *
 * POST /api/admin/impersonate
 *   header: x-impersonation-token: <IMPERSONATION_SECRET>
 *   body:   { "role": "owner" | "admin" | "manager" | "member" | "viewer" }
 *
 * All four security layers run inside performImpersonation(); ANY failure
 * returns 404 so the feature's existence is never revealed. On success the
 * caller's session cookies are replaced with the seed user's real session.
 *
 * See docs/adr/0001-admin-role-impersonation.md.
 */

const notFound = () => new NextResponse(null, { status: 404 });

export async function POST(request: NextRequest) {
  // Layer 1 (redundant, fail-closed): if the env gate is off the route 404s
  // before doing anything else, so it is effectively absent in production.
  if (!isImpersonationEnvEnabled()) return notFound();

  let role: unknown;
  try {
    const body = await request.json();
    role = (body as Record<string, unknown>)?.role;
  } catch {
    return notFound();
  }
  if (!isImpersonationRole(role)) return notFound();

  const outcome = await performImpersonation({
    targetRole: role,
    providedToken: request.headers.get('x-impersonation-token'),
    sourceIp:
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip'),
    userAgent: request.headers.get('user-agent'),
  });

  if (!outcome.ok) return notFound();

  // Session cookies were set on the server context by performImpersonation.
  return NextResponse.json({ ok: true, redirect: siteUrl('/dashboard') });
}
