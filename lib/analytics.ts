// Lightweight GA4 helpers. Safe to call anywhere; no-op until consent + GA load.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const CONSENT_KEY = "bayty_consent";
export const CONSENT_EVENT = "bayty-consent-changed";

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "all";
  } catch {
    return false;
  }
}

/** Track a conversion/interaction event. No-op if GA hasn't loaded (no consent). */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
