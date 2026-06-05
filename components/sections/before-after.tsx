"use client";

import { motion } from "framer-motion";
import { X, Check } from "lucide-react";

const BEFORE = [
  "Subcontractor credentials in a WhatsApp message you cannot find",
  "Tuesday's approval in someone's personal inbox",
  "Three versions of the same drawing on three different laptops",
  "No record of who approved what or when",
];

const AFTER = [
  "Every credential verified before work begins — government-linked check",
  "Every approval timestamped, named, and permanently on record",
  "One current version of every document — accessible to every authorised stakeholder",
  "Complete audit trail of every decision, retrievable in seconds",
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export default function BeforeAfter() {
  return (
    <section style={{ backgroundColor: "#0A1628", padding: "120px 0" }}>
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
          The Difference
        </motion.p>
        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            color: "#F8F6F1",
            maxWidth: "640px",
            marginBottom: "64px",
          }}
        >
          What changes when every decision lives in one place
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          {/* Before */}
          <motion.div
            {...fadeUpViewport(0.12)}
            style={{
              backgroundColor: "#0F1E35",
              borderLeft: "2px solid #8C3B3B",
              padding: "40px 32px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(200,120,120,0.9)",
                marginBottom: "28px",
              }}
            >
              Before Bayty
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
              {BEFORE.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <X size={18} strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px", color: "#C87878" }} aria-hidden />
                  <span
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 300,
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "rgba(248,246,241,0.6)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* After */}
          <motion.div
            {...fadeUpViewport(0.2)}
            style={{
              backgroundColor: "#0F1E35",
              borderLeft: "2px solid #C9A84C",
              padding: "40px 32px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                fontSize: "11px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "#C9A84C",
                marginBottom: "28px",
              }}
            >
              After Bayty
            </p>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "20px" }}>
              {AFTER.map((item) => (
                <li key={item} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <Check size={18} strokeWidth={2} style={{ flexShrink: 0, marginTop: "2px", color: "#C9A84C" }} aria-hidden />
                  <span
                    style={{
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 300,
                      fontSize: "14px",
                      lineHeight: 1.6,
                      color: "rgba(248,246,241,0.85)",
                    }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
