import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Combined middleware:
 *  - NextAuth (LinkedIn): redirect signed-in users away from /sign-in, /sign-up.
 *  - Supabase (email-OTP): refresh session and gate /admin and /account.
 * Only one middleware file is allowed in Next.js, so both live here.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Let NextAuth callback routes pass through untouched.
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // ---- Supabase-gated areas: /admin and /account ----
  if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
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
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  // ---- NextAuth (LinkedIn) auth pages ----
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    const session = await auth();
    if (session) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/account/:path*",
    "/sign-in",
    "/sign-up",
    "/api/auth/:path*",
  ],
};
