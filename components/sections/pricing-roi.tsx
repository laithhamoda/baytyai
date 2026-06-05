"use client";

import { motion } from "framer-motion";

const STATS = [
  {
    value: "12×",
    body: "The number of times your annual Enterprise subscription is recovered by a single prevented approval delay on a AED 10M project.",
  },
  {
    value: "20–30%",
    body: "Reduction in construction rework when approval workflows are properly documented. Rework costs 5–15% of total GCC project value annually.",
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

export default function PricingROI() {
  return (
    <section style={{ backgroundColor: "#0A1628", padding: "120px 24px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.h2
          {...fadeUp(0)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "clamp(30px, 4.5vw, 44px)",
            lineHeight: 1.15,
            color: "#F8F6F1",
            maxWidth: "720px",
            marginBottom: "64px",
          }}
        >
          The platform that pays for itself the first time it catches a delay.
        </motion.h2>

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
                border: "0.5px solid rgba(201,168,76,0.2)",
                padding: "40px 32px",
                backgroundColor: "#0F1E35",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                  fontWeight: 300,
                  fontSize: "48px",
                  lineHeight: 1,
                  color: "#C9A84C",
                  marginBottom: "20px",
                }}
              >
                {s.value}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
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
      </div>
    </section>
  );
}
