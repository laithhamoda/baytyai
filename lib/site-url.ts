/**
 * Always returns the canonical production URL — never a Vercel preview URL.
 * Use this wherever you need an absolute URL (emails, OG tags, sitemaps, redirects).
 *
 * Set NEXT_PUBLIC_SITE_URL=https://baytyai.com in Vercel production env vars.
 * Vercel also injects VERCEL_URL (no https://) for the deployment host, but we
 * explicitly refuse to use it — that's the vector that leaks *.vercel.app URLs.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ?? 'https://baytyai.com';

export function siteUrl(path: string = ''): string {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}
