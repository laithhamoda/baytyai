import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google';

import './globals.css';
import Analytics from '@/components/analytics';
import CookieBanner from '@/components/cookie-banner';
import Footer from '@/components/footer';
import LeadCaptureProvider from '@/components/forms/lead-capture-provider';
import Navigation from '@/components/navigation';

import type { Metadata } from 'next';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-body',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.baytyai.com'),
  title: {
    template: '%s | Bayty',
    default: 'Bayty',
  },
  description:
    'Luxury construction management platform purpose-built for the GCC market. Streamline projects, procurement, and teams with precision.',
};

const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Bayty AI',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web',
  url: 'https://www.baytyai.com',
  description:
    'The verified construction management platform for UAE and GCC developers. Verified stakeholders, structured approvals, document hub, and a trusted professional marketplace.',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '159',
    highPrice: '1999',
    priceCurrency: 'AED',
    offerCount: '3',
  },
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Bayty Technologies',
  url: 'https://www.baytyai.com',
  logo: 'https://www.baytyai.com/logo.png',
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@baytyai.com',
    contactType: 'customer service',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Dubai',
    addressCountry: 'AE',
  },
  sameAs: ['https://linkedin.com/company/bayty'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
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
