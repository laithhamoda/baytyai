/** @type {import('next').NextConfig} */

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    // Report-only first to avoid breaking Vercel/Google Fonts/GA; promote to
    // "Content-Security-Policy" (enforcing) after a clean reporting period.
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://app.cal.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://app.cal.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: https:",
      "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://*.supabase.co https://app.cal.com",
      "frame-src 'self' https://app.cal.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async redirects() {
    return [
      // Canonical host is the apex baytyai.com (the live Vercel project serves
      // it). Redirect any www traffic to the apex. Temporary (307) so the host
      // policy can be changed later without fighting hard browser caches.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.baytyai.com' }],
        destination: 'https://baytyai.com/:path*',
        permanent: false,
      },
      // Retired old-product marketing routes → the single-page landing.
      // Temporary (307) so they can be reinstated as real pages later.
      { source: '/product', destination: '/', permanent: false },
      { source: '/solutions', destination: '/', permanent: false },
      { source: '/solutions/:path*', destination: '/', permanent: false },
      { source: '/pricing', destination: '/', permanent: false },
      { source: '/faq', destination: '/', permanent: false },
      { source: '/demo', destination: '/', permanent: false },
      { source: '/contact', destination: '/', permanent: false },
      { source: '/request-access', destination: '/', permanent: false },
      { source: '/blog', destination: '/', permanent: false },
      { source: '/blog/:path*', destination: '/', permanent: false },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          // Block search engines from indexing *.vercel.app preview deployments.
          // On baytyai.com this header is overridden per-page by Next.js robots metadata.
          {
            key: 'X-Robots-Tag',
            value: process.env.VERCEL_ENV === 'production' ? 'index, follow' : 'noindex, nofollow',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
