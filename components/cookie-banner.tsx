"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "bayty_consent";
const CONSENT_TS_KEY = "bayty_consent_ts";
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      const choice = localStorage.getItem(CONSENT_KEY);
      const ts = Number(localStorage.getItem(CONSENT_TS_KEY) || "0");
      const fresh = ts > 0 && Date.now() - ts < ONE_YEAR_MS;
      if (!choice || !fresh) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(value: string) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      localStorage.setItem(CONSENT_TS_KEY, String(Date.now()));
    } catch {
      /* storage unavailable — ignore */
    }
    setVisible(false);
    setShowPrefs(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        style={{
          position: "fixed",
          insetInline: 0,
          bottom: 0,
          zIndex: 50,
          backgroundColor: "#0A1628",
          borderTop: "0.5px solid rgba(201,168,76,0.3)",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
              fontWeight: 300,
              fontSize: "13px",
              lineHeight: 1.6,
              color: "rgba(248,246,241,0.65)",
              maxWidth: "560px",
            }}
          >
            We use cookies to improve your experience. Essential cookies are always active.
            Analytics cookies help us improve the platform.{" "}
            <Link href="/cookies" style={{ color: "#C9A84C", textDecoration: "underline" }}>
              Cookie Policy
            </Link>
          </p>

          <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
            <button onClick={() => persist("all")} style={btnPrimary}>
              Accept all
            </button>
            <button onClick={() => persist("essential")} style={btnGhost}>
              Decline non-essential
            </button>
            <button
              onClick={() => setShowPrefs(true)}
              style={{
                fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
                fontWeight: 400,
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "rgba(248,246,241,0.6)",
                background: "none",
                border: "none",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              Manage preferences
            </button>
          </div>
        </div>
      </div>

      {/* Preferences modal */}
      {showPrefs && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 60,
            backgroundColor: "rgba(10,22,40,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          onClick={() => setShowPrefs(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#0F1E35",
              border: "0.5px solid rgba(201,168,76,0.3)",
              maxWidth: "440px",
              width: "100%",
              padding: "40px 32px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display, 'Cormorant Garamond', Georgia, serif)",
                fontWeight: 600,
                fontSize: "24px",
                color: "#F8F6F1",
                marginBottom: "24px",
              }}
            >
              Cookie preferences
            </h2>

            <ToggleRow
              label="Essential"
              description="Required for the platform to function. Always active."
              checked
              disabled
              onChange={() => {}}
            />
            <ToggleRow
              label="Analytics"
              description="Helps us understand how the platform is used."
              checked={analytics}
              onChange={() => setAnalytics((v) => !v)}
            />
            <ToggleRow
              label="Marketing"
              description="Used to measure campaign performance."
              checked={marketing}
              onChange={() => setMarketing((v) => !v)}
            />

            <div style={{ display: "flex", gap: "12px", marginTop: "28px" }}>
              <button
                onClick={() => persist(analytics || marketing ? "all" : "essential")}
                style={{ ...btnPrimary, flex: 1 }}
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "16px",
        padding: "16px 0",
        borderBottom: "0.5px solid rgba(201,168,76,0.15)",
      }}
    >
      <div>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 500,
            fontSize: "14px",
            color: "#F8F6F1",
            marginBottom: "4px",
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
            fontWeight: 300,
            fontSize: "12px",
            lineHeight: 1.5,
            color: "rgba(248,246,241,0.5)",
          }}
        >
          {description}
        </p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        style={{
          flexShrink: 0,
          width: "44px",
          height: "24px",
          borderRadius: "999px",
          border: "0.5px solid rgba(201,168,76,0.4)",
          backgroundColor: checked ? "#C9A84C" : "transparent",
          position: "relative",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
          transition: "background-color 0.2s ease",
        }}
      >
        <span
          style={{
            position: "absolute",
            top: "2px",
            left: checked ? "22px" : "2px",
            width: "18px",
            height: "18px",
            borderRadius: "999px",
            backgroundColor: checked ? "#0A1628" : "#C9A84C",
            transition: "left 0.2s ease",
          }}
        />
      </button>
    </div>
  );
}

const btnPrimary: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 500,
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#0A1628",
  backgroundColor: "#C9A84C",
  border: "0.5px solid #C9A84C",
  borderRadius: 0,
  padding: "12px 22px",
  cursor: "pointer",
};

const btnGhost: React.CSSProperties = {
  fontFamily: "var(--font-body, 'DM Sans', system-ui, sans-serif)",
  fontWeight: 400,
  fontSize: "12px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#C9A84C",
  backgroundColor: "transparent",
  border: "0.5px solid #C9A84C",
  borderRadius: 0,
  padding: "12px 22px",
  cursor: "pointer",
};
