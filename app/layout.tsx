import {
  Inter_Tight,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
  Playfair_Display,
  Cormorant_Garamond,
  DM_Sans,
  DM_Mono,
} from 'next/font/google';

import './globals.css';
import Analytics from '@/components/analytics';
import CookieBanner from '@/components/cookie-banner';
import Footer from '@/components/footer';
import LeadCaptureProvider from '@/components/forms/lead-capture-provider';
import Navigation from '@/components/navigation';
import JsonLd from '@/components/seo/JsonLd';
import { siteConfig } from '@/lib/siteConfig';

import type { Metadata } from 'next';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '600'],
  variable: '--font-arabic',
  display: 'swap',
});

// ─── Lux brand system (navy + gold) — scoped to the marketing rebuild ───
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-dm-mono',
  display: 'swap',
});

const SITE_TITLE = 'BaytyAI | Elite Mega-Project SaaS Platform for $1B+ Programs';
const SITE_DESCRIPTION =
  'What system do top global contractors use to govern $1B+ programs? BaytyAI unifies construction ERP governance, approvals, documents, claims, risk, and compliance.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl),
  title: {
    template: '%s | BaytyAI',
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Laith Hamoda', url: siteConfig.founder.linkedin }],
  keywords: [
    'AI construction management software',
    'mega project management software',
    'construction project control software',
    'infrastructure project control platform',
    'construction approval workflow software',
    'construction document control software',
    'construction claims management software',
    'construction variation order software',
    'contractor prequalification software',
    'contractor verification',
    'capital project management software',
    'global construction SaaS',
    'government construction project software',
  ],
  alternates: {
    canonical: '/',
    languages: { en: '/', ar: '/ar' },
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: 'BaytyAI',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: siteConfig.siteUrl,
    locale: 'en_US',
    alternateLocale: ['ar_AE'],
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'BaytyAI elite mega-project SaaS platform for global contractors',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${playfair.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable} ${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-[#0052cc] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#ffffff]"
        >
          Skip to main content
        </a>
        <JsonLd />
        <LeadCaptureProvider>
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </LeadCaptureProvider>
        <CookieBanner />
        <Analytics />
      </body>
    </html>
  );
}
