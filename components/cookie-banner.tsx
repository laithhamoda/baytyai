"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const CONSENT_KEY = "bayty_consent";
const CONSENT_TS_KEY = "bayty_consent_ts";

type Consent = "all" | "essential";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      setVisible(true);
    }
  }, []);

  function persist(value: Consent) {
    try {
      localStorage.setItem(CONSENT_KEY, value);
      localStorage.setItem(CONSENT_TS_KEY, new Date().toISOString());
    } catch {
      /* storage unavailable — ignore */
    }
    // Notify the Analytics component so GA loads/unloads without a reload.
    try {
      window.dispatchEvent(new Event("bayty-consent-changed"));
    } catch {
      /* ignore */
    }
    setVisible(false);
    setShowPrefs(false);
  }

  if (!visible) return null;

  return (
    <>
      {/* Banner */}
      <div
        className="fixed inset-x-0 bottom-0 z-50 bg-navy px-6 py-5 text-offwhite"
        style={{ borderTop: "0.5px solid rgba(201,168,76,0.3)" }}
      >
        <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-5 md:flex-row md:items-center">
          <p className="max-w-xl font-body text-[13px] font-light leading-relaxed text-offwhite/65">
            We use cookies on Bayty. Essential cookies keep the platform working.
            Analytics cookies help us improve your experience.{" "}
            <Link href="/cookies" className="text-gold underline">
              Cookie Policy
            </Link>
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => persist("all")}
              className="bg-gold px-5 py-3 font-body text-[12px] font-medium uppercase tracking-[0.1em] text-navy"
              style={{ borderRadius: 0 }}
            >
              Accept all
            </button>
            <button
              onClick={() => persist("essential")}
              className="bg-transparent px-5 py-3 font-body text-[12px] font-normal uppercase tracking-[0.1em] text-gold"
              style={{ border: "0.5px solid #C9A84C", borderRadius: 0 }}
            >
              Decline non-essential
            </button>
            <button
              onClick={() => setShowPrefs(true)}
              className="font-body text-[12px] font-normal tracking-[0.06em] text-offwhite/60 underline"
            >
              Manage preferences ↗
            </button>
          </div>
        </div>
      </div>

      {/* Preferences modal */}
      {showPrefs && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[60] flex items-center justify-center bg-navy/80 px-6"
          onClick={() => setShowPrefs(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-10"
            style={{ backgroundColor: "#0F1E35", border: "0.5px solid rgba(201,168,76,0.3)", borderRadius: 0 }}
          >
            <h2 className="mb-6 font-display text-2xl font-semibold text-offwhite">
              Cookie preferences
            </h2>

            <ToggleRow
              label="Essential cookies"
              description="Required for the platform to function. Always active."
              checked
              disabled
              onChange={() => {}}
            />
            <ToggleRow
              label="Analytics cookies"
              description="Help us understand which features are most useful."
              checked={analytics}
              onChange={() => setAnalytics((v) => !v)}
            />
            <ToggleRow
              label="Marketing cookies"
              description="Not currently used by Bayty."
              checked={marketing}
              onChange={() => setMarketing((v) => !v)}
            />

            <button
              onClick={() => persist(analytics || marketing ? "all" : "essential")}
              className="mt-7 w-full bg-gold py-3 font-body text-[12px] font-medium uppercase tracking-[0.12em] text-navy"
              style={{ borderRadius: 0 }}
            >
              Save preferences
            </button>
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
      className="flex items-start justify-between gap-4 py-4"
      style={{ borderBottom: "0.5px solid rgba(201,168,76,0.15)" }}
    >
      <div>
        <p className="mb-1 font-body text-sm font-medium text-offwhite">{label}</p>
        <p className="font-body text-xs font-light leading-snug text-offwhite/50">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={onChange}
        className="relative h-6 w-11 flex-shrink-0 transition-colors"
        style={{
          borderRadius: "999px",
          border: "0.5px solid rgba(201,168,76,0.4)",
          backgroundColor: checked ? "#C9A84C" : "transparent",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <span
          className="absolute top-[2px] h-[18px] w-[18px] transition-all"
          style={{
            left: checked ? "22px" : "2px",
            borderRadius: "999px",
            backgroundColor: checked ? "#0A1628" : "#C9A84C",
          }}
        />
      </button>
    </div>
  );
}
