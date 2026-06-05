"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const ROLES = [
  {
    name: "General Manager / Owner",
    description:
      "Full project creation, team assembly, approval authority, and analytics across every active development.",
    href: "/solutions/owner",
  },
  {
    name: "Design Engineer",
    description:
      "Assigned to projects, receives drawing briefs, manages design revisions and document versioning.",
    href: "/solutions/design-engineer",
  },
  {
    name: "Space / MEP / HVAC Engineer",
    description:
      "Receives technical scope, manages mechanical, electrical, and fit-out specifications end to end.",
    href: "/solutions/mep-engineer",
  },
  {
    name: "Consultant",
    description:
      "Contract execution, supervision oversight, installation scope management, and revision sign-off.",
    href: "/solutions/consultant",
  },
  {
    name: "Subcontractor",
    description:
      "Installation briefs, supply editing, and structured access to project documents and approvals.",
    href: "/solutions/subcontractor",
  },
  {
    name: "Freelance Professional",
    description:
      "Verified freelancer directory, searchable by specialism and GCC region for rapid engagement.",
    href: "/solutions/freelancer",
  },
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  };
}

export default function SolutionsClient() {
  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "160px 48px 120px",
        }}
      >
        <motion.p
          {...fadeUpViewport(0)}
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          Solutions
        </motion.p>

        <motion.h1
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "64px",
            lineHeight: 1.08,
            color: "#F8F6F1",
            maxWidth: "720px",
            marginBottom: "28px",
          }}
        >
          Built for every role in the project
        </motion.h1>

        <motion.p
          {...fadeUpViewport(0.16)}
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: 1.75,
            color: "rgba(248,246,241,0.6)",
            maxWidth: "540px",
          }}
        >
          Bayty gives each stakeholder exactly the access and tools their role
          requires — no more, no less.
        </motion.p>
      </section>

      {/* ── Role cards ── */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 48px 120px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          {ROLES.map((role, i) => (
            <motion.div
              key={role.name}
              {...fadeUpViewport(0.06 * i)}
              style={{
                backgroundColor: "#0F1E35",
                border: "0.5px solid rgba(201,168,76,0.25)",
                padding: "36px 32px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontWeight: 600,
                  fontSize: "20px",
                  lineHeight: 1.2,
                  color: "#C9A84C",
                }}
              >
                {role.name}
              </h2>

              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(248,246,241,0.6)",
                  flexGrow: 1,
                }}
              >
                {role.description}
              </p>

              <Link
                href={role.href}
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 400,
                  fontSize: "13px",
                  letterSpacing: "0.06em",
                  color: "#C9A84C",
                  alignSelf: "flex-start",
                  borderBottom: "0.5px solid rgba(201,168,76,0.35)",
                  paddingBottom: "2px",
                  transition: "border-color 0.2s ease, opacity 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A84C";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.35)";
                }}
              >
                Learn more →
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA Panel ── */}
      <motion.section
        {...fadeUpViewport(0.1)}
        style={{
          backgroundColor: "#F8F6F1",
          padding: "80px 48px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 600,
              fontSize: "40px",
              lineHeight: 1.15,
              color: "#0A1628",
              maxWidth: "480px",
            }}
          >
            Every role. One verified platform.
          </h2>

          <Link
            href="/product"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "56px",
              padding: "0 36px",
              backgroundColor: "#0A1628",
              color: "#C9A84C",
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 0,
              border: "none",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#2C3E50";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0A1628";
            }}
          >
            Explore Platform →
          </Link>
        </div>
      </motion.section>

    </div>
  );
}
