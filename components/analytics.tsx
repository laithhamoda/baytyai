'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

import { GA_ID, CONSENT_EVENT, hasAnalyticsConsent } from '@/lib/analytics';

/**
 * Loads Google Analytics 4 only after the user grants "all" cookie consent
 * (PDPL/GDPR compliant). Reacts live to consent changes via a custom event
 * dispatched by the cookie banner — no page reload required.
 */
export default function Analytics() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (hasAnalyticsConsent()) setEnabled(true);
    const onChange = () => setEnabled(hasAnalyticsConsent());
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (!GA_ID || !enabled) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
