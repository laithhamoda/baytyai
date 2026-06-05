"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface RoleDetailProps {
  overline: string;
  title: string;
  intro: string;
  capabilities: { name: string; body: string }[];
}

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  };
}

export default function RoleDetail({ overline, title, intro, capabilities }: RoleDetailProps) {
  return (
    <div style={{ backgroundColor: "#0A1628", minHeight: "100vh" }}>
      {/* Hero */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "160px 48px 96px" }}>
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
          {overline}
        </motion.p>
        <motion.h1
          {...fadeUp(0.08)}
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
          {title}
        </motion.h1>
        <motion.p
          {...fadeUp(0.16)}
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: 1.8,
            color: "rgba(248,246,241,0.6)",
            maxWidth: "560px",
          }}
        >
          {intro}
        </motion.p>
      </section>

      {/* Capabilities */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 48px 120px" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.name}
              {...fadeUp(0.06 * i)}
              style={{
                backgroundColor: "#0F1E35",
                border: "0.5px solid rgba(201,168,76,0.25)",
                padding: "32px 28px",
              }}
            >
              <div style={{ width: "24px", height: "0.5px", backgroundColor: "#C9A84C", marginBottom: "20px" }} />
              <h2
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#F8F6F1",
                  marginBottom: "12px",
                  letterSpacing: "0.02em",
                }}
              >
                {cap.name}
              </h2>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(248,246,241,0.6)",
                }}
              >
                {cap.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ backgroundColor: "#F8F6F1", padding: "80px 48px" }}>
        <div
          style={{
            maxWidth: "1000px",
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
              fontSize: "36px",
              lineHeight: 1.15,
              color: "#0A1628",
              maxWidth: "440px",
            }}
          >
            Ready to see Bayty in action?
          </h2>
          <Link
            href="/demo"
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
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            Request Private Access →
          </Link>
        </div>
      </section>
    </div>
  );
}
