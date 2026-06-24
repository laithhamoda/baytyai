'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect, useState } from 'react';

import { siteConfig } from '@/lib/siteConfig';

interface CalEmbedProps {
  calLink?: string;
}

export default function CalEmbed({ calLink = siteConfig.calBookingUrl ?? '' }: CalEmbedProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!calLink) return;
    getCalApi().then((cal) => {
      cal('ui', {
        theme: 'dark',
        styles: { branding: { brandColor: '#C5A572' } },
        hideEventTypeDetails: false,
      });
      setReady(true);
    });
  }, [calLink]);

  if (!calLink) {
    return (
      <div className="flex min-h-[720px] items-center justify-center border border-[#21262d] bg-[#0e1116] p-8 text-center text-sm text-[#6e7681]">
        Booking not configured. Set{' '}
        <code className="mx-1 font-mono text-[#c5a572]">NEXT_PUBLIC_CAL_BOOKING_URL</code>.
      </div>
    );
  }

  return (
    <div className="relative min-h-[720px] w-full">
      {!ready && <div className="absolute inset-0 animate-pulse bg-[#0e1116]" aria-hidden="true" />}
      <Cal
        calLink={calLink}
        style={{ width: '100%', height: '720px', overflow: 'scroll' }}
        config={{ layout: 'month_view' }}
      />
    </div>
  );
}
