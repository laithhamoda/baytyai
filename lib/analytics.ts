// Lightweight GA4 helpers. Safe to call anywhere; no-op until consent + GA load.

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export const CONSENT_KEY = 'bayty_consent';
export const CONSENT_EVENT = 'bayty-consent-changed';

export function hasAnalyticsConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'all';
  } catch {
    return false;
  }
}

// ─── Typed event catalog ───────────────────────────────────────────────────

type BaseProps = {
  userId?: string;
  sessionId: string;
  page: string;
  elementId: string;
};

export type AnalyticsEvent =
  | { name: 'signup_click'; props: BaseProps & { source: 'header' | 'pricing' | 'hero' } }
  | { name: 'signup_success'; props: BaseProps & { userId: string } }
  | { name: 'create_project_start'; props: BaseProps }
  | { name: 'create_project_submit'; props: BaseProps & { projectId: string } }
  | { name: 'file_upload_start'; props: BaseProps & { fileType: string; sizeBytes: number } }
  | { name: 'file_upload_success'; props: BaseProps & { fileId: string } }
  | { name: 'file_upload_error'; props: BaseProps & { reason: string } };

/** Typed track — no-op without "all" cookie consent. */
export function track(e: AnalyticsEvent): void {
  if (typeof window === 'undefined' || !hasAnalyticsConsent()) return;
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', e.name, e.props as Record<string, unknown>);
}

/** Untyped legacy helper — kept for backwards compat; prefer track(). */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

/** Per-tab session ID for grouping events without a user login. */
export function getSessionId(): string {
  if (typeof window === 'undefined') return 'ssr';
  const key = 'bayty_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem(key, sid);
  }
  return sid;
}
