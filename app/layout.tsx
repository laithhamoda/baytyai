import { siteConfig } from '@/lib/siteConfig';

import {
  Inter_Tight,
  JetBrains_Mono,
  IBM_Plex_Sans_Arabic,
  Playfair_Display,
} from 'next/font/google';

import './globals.css';
import Analytics from '@/components/analytics';
import CookieBanner from '@/components/cookie-banner';
import Footer from '@/components/footer';
import LeadCaptureProvider from '@/components/forms/lead-capture-provider';
import Navigation from '@/components/navigation';
import JsonLd from '@/components/seo/JsonLd';

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

// title.default: 49 chars  ✓ (<60)
// description:  142 chars  ✓ (<155)
const SITE_TITLE = 'BaytyAI — Global Verified Construction & FM Marketplace';
const SITE_DESCRIPTION =
  'BaytyAI is the global platform connecting verified clients, consultants, contractors, subcontractors, and suppliers — with structured inquiries, quotations, approvals, and document control for construction and facilities-management projects.';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.siteUrl),
  title: {
    template: '%s | BaytyAI',
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: 'Laith Hamoda', url: siteConfig.founder.linkedin }],
  keywords: [
    'construction marketplace',
    'verified contractors',
    'construction RFQ platform',
    'request for quotation construction',
    'facilities management marketplace',
    'subcontractor marketplace',
    'construction supplier directory',
    'construction procurement platform',
    'contractor verification',
    'construction document approval software',
    'global construction platform',
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
        alt: 'BaytyAI — AI for GCC Facilities Management and Construction',
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
      className={`${interTight.variable} ${playfair.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-[#c5a572] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-[#07090c]"
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
