"use client";

import { motion } from "framer-motion";

const STATS = [
  {
    value: "12×",
    body: "The number of times your annual Enterprise subscription is recovered by a single prevented approval delay on a AED 10M project.",
  },
  {
    value: "20–30%",
    body: "Industry-benchmark reduction in construction rework when approval workflows are properly documented. Rework costs 5–15% of total GCC project value annually.",
  },
  {
    value: "AED 23,988",
    body: "Your Enterprise subscription cost per year. One prevented week of contractor downtime on a AED 10M project saves this amount four times over.",
  },
];

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

const serif = "var(--font-display, 'Cormorant Garamond', Georgia, serif)";
const sans = "var(--font-body, 'DM Sans', system-ui, sans-serif)";

export default function PricingROI() {
  return (
    <section style={{ backgroundColor: "#0A1628", padding: "120px 24px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Overline */}
        <motion.p
          {...fadeUp(0)}
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.25em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          The Return
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUp(0.08)}
          style={{
            fontFamily: serif,
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.15,
            color: "#F8F6F1",
            maxWidth: "760px",
            marginBottom: "64px",
          }}
        >
          The platform that pays for itself the first time it catches a delay.
        </motion.h2>

        {/* Stat cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "24px",
          }}
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.value}
              {...fadeUp(0.08 * i)}
              style={{
                backgroundColor: "#0F1E35",
                border: "0.5px solid rgba(201,168,76,0.3)",
                padding: "40px 32px",
              }}
            >
              <p
                style={{
                  fontFamily: serif,
                  fontWeight: 300,
                  fontSize: "clamp(56px, 9vw, 96px)",
                  lineHeight: 1,
                  color: "#C9A84C",
                  marginBottom: "24px",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: sans,
                  fontWeight: 300,
                  fontSize: "14px",
                  lineHeight: 1.7,
                  color: "rgba(248,246,241,0.6)",
                }}
              >
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Callout */}
        <motion.p
          {...fadeUp(0.3)}
          style={{
            fontFamily: serif,
            fontStyle: "italic",
            fontWeight: 300,
            fontSize: "clamp(20px, 2.6vw, 26px)",
            lineHeight: 1.5,
            color: "#F8F6F1",
            maxWidth: "760px",
            marginTop: "56px",
          }}
        >
          One prevented delay. One recovered subscription. Every project thereafter is pure
          platform value.
        </motion.p>
      </div>
    </section>
  );
}
