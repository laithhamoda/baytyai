"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const STATS = [
  { value: "$1.3T", label: "Active GCC projects" },
  { value: "6", label: "Target markets" },
  { value: "9-stage", label: "Project lifecycle" },
];

const VALUES = [
  {
    title: "Verification First",
    body: "We verify every professional before they touch a live project.",
  },
  {
    title: "Total Transparency",
    body: "Every approval, every revision, every communication — on record.",
  },
  {
    title: "Built for the Gulf",
    body: "Designed for GCC compliance, Arabic-first culture, and regional regulations.",
  },
];

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  };
}

export default function AboutClient() {
  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh" }}>

      {/* ── 1. Mission Hero ── */}
      <section style={{ padding: "160px 48px 120px", maxWidth: "1200px", margin: "0 auto" }}>
        <motion.p
          {...fadeUp(0)}
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "28px",
          }}
        >
          Our Mission
        </motion.p>

        <motion.h1
          {...fadeUp(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "72px",
            lineHeight: 1.05,
            color: "#F8F6F1",
            maxWidth: "780px",
            marginBottom: "72px",
          }}
        >
          The Gulf deserves a better way to build
        </motion.h1>

        {/* Two-column: mission text + stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "64px",
            alignItems: "start",
          }}
          className="flex-col-mobile"
        >
          {/* Left: mission statement */}
          <motion.p
            {...fadeUp(0.16)}
            style={{
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 300,
              fontSize: "18px",
              lineHeight: 1.8,
              color: "rgba(248,246,241,0.6)",
            }}
          >
            The GCC construction sector manages some of the most complex and
            capital-intensive projects on earth. Yet the infrastructure that
            connects owners, engineers, consultants, and contractors remains
            fragmented, unverified, and opaque. Bayty exists to change that —
            bringing trust, transparency, and structure to every stage of the
            GCC project lifecycle.
          </motion.p>

          {/* Right: stat cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.value}
                {...fadeUp(0.2 + i * 0.08)}
                style={{
                  backgroundColor: "#0A1628",
                  border: "0.5px solid rgba(201,168,76,0.3)",
                  padding: "24px 28px",
                  display: "flex",
                  alignItems: "baseline",
                  gap: "16px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontWeight: 300,
                    fontSize: "36px",
                    color: "#C9A84C",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: "14px",
                    color: "rgba(248,246,241,0.55)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 2. Values ── */}
      <section
        style={{
          borderTop: "0.5px solid rgba(201,168,76,0.15)",
          borderBottom: "0.5px solid rgba(201,168,76,0.15)",
          padding: "120px 48px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <motion.h2
            {...fadeUp(0)}
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 300,
              fontSize: "48px",
              lineHeight: 1.1,
              color: "#F8F6F1",
              marginBottom: "64px",
            }}
          >
            What we stand for
          </motion.h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "0",
            }}
          >
            {VALUES.map((v, i) => (
              <motion.div
                key={v.title}
                {...fadeUp(0.08 + i * 0.1)}
                style={{
                  padding: "40px 36px",
                  borderLeft: i === 0 ? "none" : "0.5px solid rgba(201,168,76,0.15)",
                }}
              >
                <div
                  style={{
                    width: "24px",
                    height: "0.5px",
                    backgroundColor: "#C9A84C",
                    marginBottom: "24px",
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 500,
                    fontSize: "16px",
                    color: "#F8F6F1",
                    letterSpacing: "0.04em",
                    marginBottom: "14px",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: 1.75,
                    color: "rgba(248,246,241,0.55)",
                  }}
                >
                  {v.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Founding Story ── */}
      <section style={{ padding: "120px 48px" }}>
        <motion.blockquote
          {...fadeUp(0)}
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            textAlign: "center",
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "24px",
            lineHeight: 1.7,
            color: "#F8F6F1",
            borderLeft: "none",
            padding: 0,
          }}
        >
          "Bayty was founded on a single observation: that the GCC construction
          industry — responsible for the most ambitious built environment on
          earth — was still being managed through WhatsApp groups and scattered
          email chains. We built the platform we wished existed."
        </motion.blockquote>
      </section>

      {/* ── 4. Team CTA ── */}
      <section
        style={{
          backgroundColor: "#F8F6F1",
          padding: "100px 48px",
        }}
      >
        <motion.div
          {...fadeUp(0)}
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
          <div style={{ maxWidth: "520px" }}>
            <h2
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontWeight: 600,
                fontSize: "40px",
                lineHeight: 1.15,
                color: "#0A1628",
                marginBottom: "16px",
              }}
            >
              We are building the team
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: 1.75,
                color: "rgba(10,22,40,0.65)",
              }}
            >
              If you are exceptional in construction technology, enterprise
              sales, or GCC real estate, we would like to speak with you.
            </p>
          </div>

          <Link
            href="mailto:info@baytyai.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "56px",
              padding: "0 36px",
              backgroundColor: "#0A1628",
              color: "#F8F6F1",
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 0,
              flexShrink: 0,
              whiteSpace: "nowrap",
              transition: "background-color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#2C3E50";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0A1628";
            }}
          >
            Send an introduction
          </Link>
        </motion.div>
      </section>

    </div>
  );
}
