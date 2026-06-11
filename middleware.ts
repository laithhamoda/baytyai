import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

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

    // ---- KYC gate: only applies to /dashboard routes ----
    if (pathname.startsWith('/dashboard')) {
      // Always allow access to the verification flow itself.
      const isVerificationRoute =
        pathname === '/dashboard/verify-identity' ||
        pathname.startsWith('/dashboard/verify-identity/');

      if (!isVerificationRoute) {
        // Check identity verification status.
        const { data: verification } = await supabase
          .from('identity_verifications')
          .select('status')
          .eq('user_id', user.id)
          .single();

        const isApproved = verification?.status === 'approved';

        if (!isApproved) {
          // Redirect to KYC flow with the intended destination preserved.
          const verifyUrl = new URL('/dashboard/verify-identity', request.url);
          verifyUrl.searchParams.set('next', pathname);
          return NextResponse.redirect(verifyUrl);
        }
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
    '/admin/:path*',
    '/account/:path*',
    '/dashboard/:path*',
    '/sign-in',
    '/sign-up',
    '/api/auth/:path*',
  ],
};
