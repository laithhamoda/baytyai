import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

import { auth } from '@/auth';
import { checkRouteRbac } from '@/lib/auth/rbac';

import type { OrgRole } from '@/lib/types/tenancy';

/**
 * Combined middleware:
 *  - NextAuth (LinkedIn): redirect signed-in users away from /sign-in, /sign-up.
 *  - Supabase (email-OTP): refresh session, gate /admin, /account, and /dashboard.
 *  - KYC gate: users accessing /dashboard (except /dashboard/verify-identity)
 *    must have an approved identity_verification record.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let NextAuth callback routes pass through untouched.
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  // ---- Supabase-gated areas: /admin, /account, /dashboard ----
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/account') ||
    pathname.startsWith('/dashboard')
  ) {
    let response = NextResponse.next({ request });
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Supabase not configured yet — allow through during pre-wiring.
    if (!url || !anon) return response;

    const supabase = createServerClient(url, anon, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Not authenticated — send to /login with a return URL.
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // ---- Dashboard gates ----
    if (pathname.startsWith('/dashboard')) {
      const isVerificationRoute =
        pathname === '/dashboard/verify-identity' ||
        pathname.startsWith('/dashboard/verify-identity/');
      const isSetupRoute =
        pathname === '/dashboard/setup-org' || pathname.startsWith('/dashboard/setup-org/');

      if (!isVerificationRoute && !isSetupRoute) {
        // KYC gate
        const { data: verification } = await supabase
          .from('identity_verifications')
          .select('status')
          .eq('user_id', user.id)
          .single();

        if (verification?.status !== 'approved') {
          const verifyUrl = new URL('/dashboard/verify-identity', request.url);
          verifyUrl.searchParams.set('next', pathname);
          return NextResponse.redirect(verifyUrl);
        }

        // Org-setup gate — user must belong to an org
        const meta = user.app_metadata as Record<string, string | undefined>;
        const orgId = meta.org_id ?? null;
        if (!orgId) {
          return NextResponse.redirect(new URL('/dashboard/setup-org', request.url));
        }

        // RBAC gate — route-level role check
        const orgRole = (meta.org_role ?? null) as OrgRole | null;
        const isSystemAdmin = false; // extend when profiles.role check is needed
        const rbacRedirect = checkRouteRbac(request, orgRole, isSystemAdmin);
        if (rbacRedirect) return rbacRedirect;
      }
    }

    return response;
  }

  // ---- NextAuth (LinkedIn) auth pages ----
  if (pathname === '/sign-in' || pathname === '/sign-up') {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/account',
    '/account/:path*',
    '/dashboard',
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/api/auth/:path*',
  ],
};
