import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/supabase/auth";
import { signOutUser } from "./actions";

export const metadata: Metadata = {
  title: { absolute: "Admin — Bayty" },
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  // Not signed in → middleware already redirects, but guard here too.
  if (!user) redirect("/login?next=/admin");

  // Signed in but not an admin → explicit refusal, not a redirect loop.
  if (user.role !== "admin") {
    return (
      <div
        style={{
          backgroundColor: "#0A1628",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: "420px" }}>
          <h1
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 300,
              fontSize: "36px",
              color: "#F8F6F1",
              marginBottom: "16px",
            }}
          >
            Not authorised
          </h1>
          <p style={{ fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)", fontWeight: 300, fontSize: "15px", color: "rgba(248,246,241,0.6)", marginBottom: "28px" }}>
            Your account ({user.email}) does not have admin access.
          </p>
          <Link href="/" style={{ color: "#C9A84C", fontSize: "13px", borderBottom: "0.5px solid rgba(201,168,76,0.4)", paddingBottom: "2px" }}>
            Return to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh", color: "#F8F6F1" }}>
      <header
        style={{
          borderBottom: "0.5px solid rgba(201,168,76,0.25)",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <Link
            href="/admin"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 600,
              fontSize: "18px",
              letterSpacing: "0.2em",
              color: "#C9A84C",
              textTransform: "uppercase",
            }}
          >
            Bayty Admin
          </Link>
          <span style={{ fontFamily: "var(--font-mono, 'DM Mono', monospace)", fontSize: "10px", letterSpacing: "0.15em", color: "rgba(248,246,241,0.4)", textTransform: "uppercase" }}>
            Content
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)", fontSize: "13px", color: "rgba(248,246,241,0.5)" }}>
            {user.email}
          </span>
          <Link href="/" style={{ fontSize: "12px", color: "rgba(248,246,241,0.6)" }}>View site ↗</Link>
          <form action={signOutUser}>
            <button
              type="submit"
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontSize: "12px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#C9A84C",
                background: "none",
                border: "0.5px solid #C9A84C",
                borderRadius: 0,
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              Sign out
            </button>
          </form>
        </div>
      </header>
      <main style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 32px 120px" }}>
        {children}
      </main>
    </div>
  );
}
