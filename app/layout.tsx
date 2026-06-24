import { Inter_Tight, JetBrains_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';

import './globals.css';
import Analytics from '@/components/analytics';
import CookieBanner from '@/components/cookie-banner';
import Footer from '@/components/footer';
import LeadCaptureProvider from '@/components/forms/lead-capture-provider';
import Navigation from '@/components/navigation';

import type { Metadata } from 'next';

const interTight = Inter_Tight({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
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

const SITE_TITLE = 'BaytyAI — AI-Native Operations Infrastructure for GCC FM & Construction';
const SITE_DESCRIPTION =
  'Operator-grade AI prompt libraries and workflows that protect contract margin, accelerate mobilization, and harden SLA performance on contracts above $5M.';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.baytyai.com'),
  title: {
    template: '%s | BaytyAI',
    default: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'BaytyAI',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: 'https://www.baytyai.com',
    images: [{ url: '/opengraph-image', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image'],
  },
};

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'BaytyAI',
  serviceType: 'AI Operations Infrastructure',
  url: 'https://www.baytyai.com',
  description: SITE_DESCRIPTION,
  areaServed: {
    '@type': 'Place',
    name: 'Gulf Cooperation Council (GCC)',
  },
  provider: {
    '@type': 'Person',
    name: 'Laith Hamoda',
    jobTitle: 'Senior AI Prompt Engineer for Mega Projects',
    url: 'https://www.linkedin.com/in/laithhamoda',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BaytyAI',
  url: 'https://www.baytyai.com',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'founder@baytyai.com',
    contactType: 'sales',
  },
  sameAs: ['https://www.linkedin.com/in/laithhamoda'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${jetbrainsMono.variable} ${ibmPlexSansArabic.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
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
