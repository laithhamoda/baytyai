"use client";

import Link from "next/link";

const PLATFORM_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Insights", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
];

const muted: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: "13px",
  color: "rgba(248,246,241,0.6)",
  lineHeight: 1.6,
};

const colHead: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  fontSize: "10px",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "rgba(248,246,241,0.35)",
  marginBottom: "20px",
};

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
        fontWeight: 300,
        fontSize: "13px",
        color: "rgba(248,246,241,0.6)",
        padding: "8px 0",
        marginBottom: "4px",
        transition: "color 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "#C9A84C";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.color = "rgba(248,246,241,0.6)";
      }}
    >
      {children}
    </Link>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#0A1628",
        borderTop: "0.5px solid rgba(201,168,76,0.25)",
        padding: "72px 48px 48px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "48px",
        }}
        className="footer-grid"
      >
        {/* Col 1 — Brand */}
        <div>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 600,
              fontSize: "1.25rem",
              letterSpacing: "0.2em",
              color: "#C9A84C",
              textTransform: "uppercase",
              display: "inline-block",
              marginBottom: "16px",
            }}
          >
            Bayty
          </Link>
          <p style={{ ...muted, maxWidth: "220px", marginBottom: "24px" }}>
            The verified construction platform for the Gulf.
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: "10px",
              letterSpacing: "0.1em",
              color: "rgba(248,246,241,0.25)",
            }}
          >
            © {new Date().getFullYear()} Bayty Technologies
          </p>
        </div>

        {/* Col 2 — Platform */}
        <div>
          <p style={colHead}>Platform</p>
          {PLATFORM_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </div>

        {/* Col 3 — Legal */}
        <div>
          <p style={colHead}>Legal</p>
          {LEGAL_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </div>

        {/* Col 4 — Contact */}
        <div>
          <p style={colHead}>Contact</p>
          <FooterLink href="mailto:info@baytyai.com">info@baytyai.com</FooterLink>
          <FooterLink href="https://linkedin.com/company/bayty">
            LinkedIn <span style={{ fontFamily: "monospace", fontSize: "11px" }}>↗</span>
          </FooterLink>
          <p style={{ ...muted, marginTop: "4px" }}>Dubai, UAE</p>
        </div>

        {/* Col 5 — Investors */}
        <div>
          <p style={colHead}>Investors</p>
          <FooterLink href="mailto:investor@baytyai.com">Investor Relations</FooterLink>
          <FooterLink href="mailto:press@baytyai.com">Press Enquiries</FooterLink>
          <p
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: "10px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "rgba(201,168,76,0.55)",
              marginTop: "4px",
            }}
          >
            Seed Round 2026
          </p>
        </div>
      </div>

      {/* Bottom rule */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "48px auto 0",
          borderTop: "0.5px solid rgba(201,168,76,0.1)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "rgba(248,246,241,0.2)",
          }}
        >
          Built for the GCC construction industry
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "10px",
            letterSpacing: "0.1em",
            color: "rgba(248,246,241,0.2)",
          }}
        >
          baytyai.com
        </p>
      </div>
    </footer>
  );
}
