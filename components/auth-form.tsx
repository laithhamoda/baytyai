"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const fieldBase: React.CSSProperties = {
  width: "100%",
  height: "52px",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "0.5px solid rgba(201,168,76,0.5)",
  borderRadius: 0,
  color: "#F8F6F1",
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 300,
  fontSize: "14px",
  padding: "0 0 0 2px",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono, 'DM Mono', monospace)",
  fontSize: "10px",
  letterSpacing: "0.16em",
  textTransform: "uppercase",
  color: "rgba(248,246,241,0.5)",
  marginBottom: "6px",
  display: "block",
};

export default function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const isSignUp = mode === "sign-up";
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Backend not yet connected — see Bayty auth setup notes.
    setError("Authentication is not yet enabled. Please request private access.");
  }

  return (
    <div
      style={{
        backgroundColor: "#0A1628",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 24px 64px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: "420px" }}
      >
        <div style={{ width: "40px", height: "0.5px", backgroundColor: "#C9A84C", margin: "0 auto 32px" }} />

        <h1
          style={{
            fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
            fontWeight: 300,
            fontSize: "40px",
            lineHeight: 1.1,
            color: "#F8F6F1",
            textAlign: "center",
            marginBottom: "12px",
          }}
        >
          {isSignUp ? "Create your account" : "Sign in to Bayty"}
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "14px",
            color: "rgba(248,246,241,0.5)",
            textAlign: "center",
            marginBottom: "48px",
          }}
        >
          {isSignUp
            ? "For verified construction professionals across the GCC."
            : "Welcome back. Enter your credentials to continue."}
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          {isSignUp && (
            <div>
              <label htmlFor="name" style={labelStyle}>Full Name</label>
              <input id="name" name="name" type="text" required style={fieldBase} placeholder="Khalid Al Rashid" />
            </div>
          )}
          <div>
            <label htmlFor="email" style={labelStyle}>Work Email</label>
            <input id="email" name="email" type="email" required style={fieldBase} placeholder="khalid@company.ae" />
          </div>
          <div>
            <label htmlFor="password" style={labelStyle}>Password</label>
            <input id="password" name="password" type="password" required style={fieldBase} placeholder="••••••••" />
          </div>

          {error && (
            <p
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 300,
                fontSize: "13px",
                color: "#C9A84C",
                lineHeight: 1.5,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            style={{
              width: "100%",
              height: "56px",
              backgroundColor: "#C9A84C",
              color: "#0A1628",
              border: "none",
              borderRadius: 0,
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 500,
              fontSize: "13px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              cursor: "pointer",
              marginTop: "8px",
            }}
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "13px",
            color: "rgba(248,246,241,0.5)",
            textAlign: "center",
            marginTop: "32px",
          }}
        >
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <Link
            href={isSignUp ? "/sign-in" : "/request-access"}
            style={{ color: "#C9A84C", borderBottom: "0.5px solid rgba(201,168,76,0.4)", paddingBottom: "1px" }}
          >
            {isSignUp ? "Sign in" : "Request access"}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
