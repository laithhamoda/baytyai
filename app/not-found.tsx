"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: "#0A1628",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
      }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {/* Decorative gold rule */}
        <div
          style={{
            width: "200px",
            height: "0.5px",
            backgroundColor: "#C9A84C",
            opacity: 0.45,
            marginBottom: "40px",
          }}
        />

        {/* 404 label */}
        <p
          style={{
            fontFamily: "var(--font-mono, 'DM Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "#C9A84C",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          404
        </p>

        {/* Headline */}
        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "64px",
            lineHeight: 1.08,
            color: "#F8F6F1",
            marginBottom: "20px",
            maxWidth: "560px",
          }}
        >
          This page does not exist
        </h1>

        {/* Sub */}
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "18px",
            lineHeight: 1.75,
            color: "rgba(248,246,241,0.5)",
            maxWidth: "420px",
            marginBottom: "48px",
          }}
        >
          The page you are looking for may have moved, or the link may be
          incorrect.
        </p>

        {/* Links */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "32px",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              height: "52px",
              padding: "0 32px",
              border: "0.5px solid #C9A84C",
              color: "#C9A84C",
              backgroundColor: "transparent",
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: 0,
              transition: "background-color 0.25s ease, color 0.25s ease",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "#C9A84C";
              el.style.color = "#0A1628";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.backgroundColor = "transparent";
              el.style.color = "#C9A84C";
            }}
          >
            Return to home
          </Link>

          <Link
            href="mailto:info@baytyai.com"
            style={{
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 400,
              fontSize: "13px",
              letterSpacing: "0.08em",
              color: "#C9A84C",
              borderBottom: "0.5px solid rgba(201,168,76,0.35)",
              paddingBottom: "2px",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#C9A84C";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(201,168,76,0.35)";
            }}
          >
            Contact support
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
