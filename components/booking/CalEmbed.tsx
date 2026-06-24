'use client';

import { useEffect } from 'react';

import { siteConfig } from '@/lib/siteConfig';

interface CalEmbedProps {
  calLink?: string;
  className?: string;
}

export default function CalEmbed({
  calLink = siteConfig.calBookingUrl ?? '',
  className = '',
}: CalEmbedProps) {
  useEffect(() => {
    if (!calLink) return;

    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    script.onload = () => {
      if (typeof window !== 'undefined' && (window as unknown as Record<string, unknown>).Cal) {
        const Cal = (window as unknown as Record<string, unknown>).Cal as (
          action: string,
          ...args: unknown[]
        ) => void;
        Cal('init', { origin: 'https://app.cal.com' });
        Cal('inline', {
          elementOrSelector: '#cal-booking-embed',
          calLink,
        });
        Cal('ui', {
          styles: { branding: { brandColor: '#C9A84C' } },
          hideEventTypeDetails: false,
        });
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [calLink]);

  if (!calLink) {
    return (
      <div
        className={`flex items-center justify-center rounded border border-gold/30 bg-navy/60 p-8 text-center text-sm text-gold/60 ${className}`}
      >
        Cal.com booking URL not configured.
        <br />
        Set <code>NEXT_PUBLIC_CAL_BOOKING_URL</code> in your environment.
      </div>
    );
  }

  return (
    <div
      id="cal-booking-embed"
      className={`min-h-[600px] w-full ${className}`}
      style={{ colorScheme: 'dark' }}
    />
  );
}
