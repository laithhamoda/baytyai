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

const FEATURE_TILES = [
  {
    glyph: "◈",
    name: "Verification Layer",
    description: "Licence and credential checks for every stakeholder before access is granted.",
  },
  {
    glyph: "⊡",
    name: "Approval Workflow",
    description: "Structured sign-off chains with full audit trails and real-time status tracking.",
  },
  {
    glyph: "⊟",
    name: "Document Hub",
    description: "Drawings, contracts, and site records in one versioned, permission-controlled repository.",
  },
  {
    glyph: "◉",
    name: "Team Directory",
    description: "Verified profiles for consultants, contractors, and owners across every active project.",
  },
  {
    glyph: "◎",
    name: "Freelancer Marketplace",
    description: "Source and engage vetted independent professionals within the GCC construction ecosystem.",
  },
  {
    glyph: "⬡",
    name: "Property Marketplace",
    description: "Transact and list verified GCC real estate assets within the same authorised workspace.",
  },
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export default function Features() {
  return (
    <>
      {/* ── SECTION 1: The Problem ── */}
      <section
        style={{ backgroundColor: "#F8F6F1", padding: "120px 0" }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}
        >
          {/* Overline */}
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

          {/* Headline */}
          <motion.h2
            {...fadeUpViewport(0.1)}
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 600,
              fontSize: "48px",
              lineHeight: 1.1,
              color: "#0A1628",
              maxWidth: "640px",
              marginBottom: "64px",
            }}
          >
            Construction projects fail in the gaps between systems
          </motion.h2>

          {/* Problem cards */}
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
                {...fadeUpViewport(0.1 + i * 0.08)}
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

      {/* ── SECTION 2: The Platform ── */}
      <section
        style={{ backgroundColor: "#0A1628", padding: "120px 0" }}
      >
        <div
          style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}
        >
          {/* Overline */}
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
            The Platform
          </motion.p>

          {/* Headline */}
          <motion.h2
            {...fadeUpViewport(0.1)}
            style={{
              fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
              fontWeight: 300,
              fontSize: "56px",
              lineHeight: 1.1,
              color: "#F8F6F1",
              maxWidth: "640px",
              marginBottom: "72px",
            }}
          >
            One authorised workspace for every stage
          </motion.h2>

          {/* Feature grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "1px",
              border: "0.5px solid rgba(201,168,76,0.2)",
            }}
          >
            {FEATURE_TILES.map((tile, i) => (
              <motion.div
                key={tile.name}
                {...fadeUpViewport(0.08 * i)}
                style={{
                  backgroundColor: "#0F1E35",
                  border: "0.5px solid rgba(201,168,76,0.2)",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Glyph */}
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: "22px",
                    color: "#C9A84C",
                    lineHeight: 1,
                  }}
                  aria-hidden
                >
                  {tile.glyph}
                </span>

                {/* Feature name */}
                <h3
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 500,
                    fontSize: "15px",
                    color: "#F8F6F1",
                    letterSpacing: "0.04em",
                  }}
                >
                  {tile.name}
                </h3>

                {/* Description */}
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: "14px",
                    lineHeight: 1.7,
                    color: "rgba(248,246,241,0.5)",
                    margin: 0,
                  }}
                >
                  {tile.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
