"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Billing = "annual" | "monthly";

const TIERS = [
  {
    name: "Starter",
    monthlyPrice: 199,
    annualPrice: 159,
    for: "Small contractors and freelance engineers",
    badge: null,
    featured: false,
    enterprise: false,
    cta: "Get Started",
    ctaHref: "/request-access?tier=starter",
    features: [
      "Up to 3 projects",
      "Basic approval workflow",
      "Document upload",
      "Verified profile",
    ],
  },
  {
    name: "Professional",
    monthlyPrice: 699,
    annualPrice: 559,
    for: "Mid-size construction firms",
    badge: "MOST SELECTED",
    featured: true,
    enterprise: false,
    cta: "Get Started",
    ctaHref: "/request-access?tier=professional",
    features: [
      "Up to 15 projects",
      "Full workflow + approvals",
      "Team directory",
      "Marketplace access",
      "Priority verification",
      "Email support",
    ],
  },
  {
    name: "Enterprise",
    monthlyPrice: 2499,
    annualPrice: 1999,
    for: "Developers and project owners",
    badge: null,
    featured: false,
    enterprise: true,
    cta: "Request Access",
    ctaHref: "/request-access?tier=enterprise",
    features: [
      "Unlimited projects",
      "Custom branding",
      "API access",
      "Dedicated support",
      "Advanced analytics",
      "Guaranteed SLA",
    ],
  },
] as const;

function fadeUpViewport(delay: number) {
  return {
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, delay, ease: "easeOut" },
  };
}

export default function PricingCards() {
  const [billing, setBilling] = useState<Billing>("annual");

  return (
    <section style={{ backgroundColor: "#0A1628", padding: "120px 0" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>

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
          Membership Tiers
        </motion.p>

        {/* Headline */}
        <motion.h2
          {...fadeUpViewport(0.08)}
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "52px",
            lineHeight: 1.1,
            color: "#F8F6F1",
            maxWidth: "580px",
            marginBottom: "48px",
          }}
        >
          Choose the right structure for your portfolio
        </motion.h2>

        {/* Billing toggle */}
        <motion.div
          {...fadeUpViewport(0.14)}
          style={{ display: "flex", alignItems: "center", gap: "32px", marginBottom: "64px" }}
        >
          {(["annual", "monthly"] as Billing[]).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontSize: "14px",
                fontWeight: billing === b ? 400 : 300,
                color: billing === b ? "#F8F6F1" : "rgba(248,246,241,0.45)",
                background: "none",
                border: "none",
                borderBottom: billing === b ? "0.5px solid #C9A84C" : "0.5px solid transparent",
                paddingBottom: "4px",
                cursor: "pointer",
                letterSpacing: "0.06em",
                textTransform: "capitalize",
                transition: "color 0.2s ease, border-color 0.2s ease",
              }}
            >
              {b === "annual" ? "Annual" : "Monthly"}
            </button>
          ))}

          {/* Save pill */}
          <motion.span
            animate={{ opacity: billing === "annual" ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            style={{
              fontFamily: "var(--font-mono, 'DM Mono', monospace)",
              fontSize: "10px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#0A1628",
              backgroundColor: "#C9A84C",
              padding: "3px 10px",
              pointerEvents: "none",
            }}
          >
            Save 20%
          </motion.span>
        </motion.div>

        {/* Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              {...fadeUpViewport(0.1 + i * 0.1)}
              style={{
                position: "relative",
                backgroundColor: tier.enterprise ? "#C9A84C" : "#0F1E35",
                border: tier.featured
                  ? "2px solid #C9A84C"
                  : `0.5px solid rgba(201,168,76,${tier.enterprise ? "0.4" : "0.2"})`,
                display: "flex",
                flexDirection: "column",
                padding: tier.badge ? "48px 32px 36px" : "36px 32px",
              }}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "#C9A84C",
                    color: "#0A1628",
                    fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    padding: "5px 14px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tier.badge}
                </div>
              )}

              {/* Tier name */}
              <p
                style={{
                  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: tier.enterprise ? "#0A1628" : "#C9A84C",
                  marginBottom: "20px",
                }}
              >
                {tier.name}
              </p>

              {/* Price */}
              <div style={{ marginBottom: "8px", display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                    fontWeight: 300,
                    fontSize: "48px",
                    lineHeight: 1,
                    color: tier.enterprise ? "#0A1628" : "#F8F6F1",
                  }}
                >
                  {(billing === "annual" ? tier.annualPrice : tier.monthlyPrice).toLocaleString()}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: "13px",
                    color: tier.enterprise ? "rgba(10,22,40,0.65)" : "rgba(248,246,241,0.5)",
                  }}
                >
                  AED / mo
                </span>
              </div>

              {billing === "annual" && (
                <p
                  style={{
                    fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                    fontWeight: 300,
                    fontSize: "12px",
                    color: tier.enterprise ? "rgba(10,22,40,0.55)" : "rgba(248,246,241,0.4)",
                    marginBottom: "4px",
                  }}
                >
                  Billed annually
                </p>
              )}

              {/* For */}
              <p
                style={{
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 300,
                  fontSize: "14px",
                  color: tier.enterprise ? "rgba(10,22,40,0.7)" : "rgba(248,246,241,0.55)",
                  marginTop: "16px",
                  marginBottom: "28px",
                  lineHeight: 1.6,
                }}
              >
                {tier.for}
              </p>

              {/* Divider */}
              <div
                style={{
                  height: "0.5px",
                  backgroundColor: tier.enterprise ? "rgba(10,22,40,0.2)" : "rgba(201,168,76,0.2)",
                  marginBottom: "28px",
                }}
              />

              {/* Features */}
              <ul style={{ listStyle: "none", padding: 0, margin: 0, flexGrow: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                {tier.features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                      fontWeight: 300,
                      fontSize: "14px",
                      color: tier.enterprise ? "#0A1628" : "#F8F6F1",
                      lineHeight: 1.5,
                    }}
                  >
                    <span
                      style={{
                        color: tier.enterprise ? "#0A1628" : "#C9A84C",
                        fontSize: "12px",
                        marginTop: "2px",
                        flexShrink: 0,
                      }}
                    >
                      ✦
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={tier.ctaHref}
                style={{
                  marginTop: "36px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "52px",
                  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                  fontWeight: 400,
                  fontSize: "13px",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  backgroundColor: tier.enterprise ? "#0A1628" : "transparent",
                  color: tier.enterprise ? "#F8F6F1" : "#C9A84C",
                  border: tier.enterprise ? "none" : "0.5px solid #C9A84C",
                  transition: "background-color 0.25s ease, color 0.25s ease",
                  borderRadius: 0,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!tier.enterprise) {
                    el.style.backgroundColor = "#C9A84C";
                    el.style.color = "#0A1628";
                  } else {
                    el.style.backgroundColor = "#0F1E35";
                  }
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  if (!tier.enterprise) {
                    el.style.backgroundColor = "transparent";
                    el.style.color = "#C9A84C";
                  } else {
                    el.style.backgroundColor = "#0A1628";
                  }
                }}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          {...fadeUpViewport(0.5)}
          style={{
            marginTop: "72px",
            backgroundColor: "#F8F6F1",
            padding: "56px 64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "48px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontWeight: 600,
                fontSize: "32px",
                lineHeight: 1.15,
                color: "#0A1628",
                marginBottom: "10px",
              }}
            >
              For government entities and real estate portfolios
            </h3>
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 300,
                fontSize: "15px",
                color: "rgba(10,22,40,0.65)",
                lineHeight: 1.65,
              }}
            >
              Corporate and white-label accounts available. Speak with our enterprise team.
            </p>
          </div>

          <Link
            href="/contact?type=enterprise"
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
              border: "none",
              borderRadius: 0,
              whiteSpace: "nowrap",
              transition: "background-color 0.25s ease",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#2C3E50"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "#0A1628"; }}
          >
            Arrange a Consultation
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
