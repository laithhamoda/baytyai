"use client";

import { motion } from "framer-motion";

interface Stage {
  n: string;
  title: string;
  desc: string;
}

const STAGES: Stage[] = [
  { n: "1", title: "Project Brief", desc: "Define scope, budget, and timeline." },
  { n: "2", title: "Team Assembly", desc: "Invite and verify every stakeholder." },
  { n: "3", title: "Design Brief", desc: "Issue drawing briefs to engineers." },
  { n: "4", title: "Technical Specs", desc: "Capture MEP and fit-out requirements." },
  { n: "5", title: "Consultant Scope", desc: "Assign supervision and contracts." },
  { n: "6", title: "Subcontractor Brief", desc: "Distribute installation packages." },
  { n: "7", title: "Execution & Approvals", desc: "Track sign-offs in real time." },
  { n: "8", title: "Inspections", desc: "Log quality checks with records." },
  { n: "9", title: "Handover", desc: "Close out with a full audit trail." },
];

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: "easeOut" },
  };
}

export default function HowItWorks() {
  return (
    <section style={{ backgroundColor: "#F8F6F1", padding: "120px 0" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>
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
          The Workflow
        </motion.p>
        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "clamp(32px, 5vw, 48px)",
            lineHeight: 1.1,
            color: "#0A1628",
            maxWidth: "640px",
            marginBottom: "72px",
          }}
        >
          Your entire project lifecycle — in one authorised workspace
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "32px 24px",
          }}
        >
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.n}
              {...fadeUpViewport(0.04 * i)}
              style={{ position: "relative", paddingTop: "20px", borderTop: "0.5px solid rgba(201,168,76,0.4)" }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                  fontSize: "12px",
                  letterSpacing: "0.1em",
                  color: "#C9A84C",
                  display: "block",
                  marginBottom: "10px",
                }}
              >
                {stage.n.padStart(2, "0")}
              </span>
              <h3
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 500,
                  fontSize: "15px",
                  color: "#0A1628",
                  marginBottom: "8px",
                }}
              >
                {stage.title}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "13px",
                  lineHeight: 1.6,
                  color: "rgba(44,62,80,0.7)",
                }}
              >
                {stage.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
