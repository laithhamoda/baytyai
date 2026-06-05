"use client";

import { useState } from "react";

export default function CookieBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div
      style={{ borderTop: "0.5px solid var(--gold-border)" }}
      className="fixed inset-x-0 bottom-0 z-50 bg-navy px-8 py-5"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-8">
        <p className="text-sm font-light text-offwhite/60">
          We use cookies to improve your experience on Bayty.
        </p>
        <button
          onClick={() => setDismissed(true)}
          style={{ border: "0.5px solid var(--gold-border)" }}
          className="shrink-0 px-6 py-2 text-xs font-light tracking-widest text-gold uppercase hover:bg-gold/10 transition-colors"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
