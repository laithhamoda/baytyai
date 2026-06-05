"use client";

import { motion } from "framer-motion";

const PROBLEM_CARDS = [
  {
    title: "Unverified Stakeholders",
    body: "No standardised way to confirm a consultant's licence or a subcontractor's credentials before work begins.",
  },
  {
    title: "Approval Bottlenecks",
    body: "Waiting approvals, under-processing items, and pending sign-offs tracked in scattered emails and messaging apps.",
  },
  {
    title: "No Shared Record",
    body: "Drawings, contracts, and site updates live in fragmented systems with no single source of truth.",
  },
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export default function Problem() {
  return (
    <section style={{ backgroundColor: "#F8F6F1", padding: "120px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <motion.p
          {...fadeUpViewport(0)}
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          The Challenge
        </motion.p>

        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 600,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            color: "#0A1628",
            maxWidth: "640px",
            marginBottom: "64px",
          }}
        >
          Construction projects fail in the gaps between systems
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {PROBLEM_CARDS.map((card, i) => (
            <motion.div
              key={card.title}
              {...fadeUpViewport(0.08 + i * 0.08)}
              style={{
                backgroundColor: "#0A1628",
                borderLeft: "0.5px solid #C9A84C",
                padding: "32px 28px",
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 500,
                  fontSize: "16px",
                  color: "#F8F6F1",
                  marginBottom: "12px",
                  letterSpacing: "0.02em",
                }}
              >
                {card.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(248,246,241,0.65)",
                }}
              >
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
