'use client';

import Cal, { getCalApi } from '@calcom/embed-react';
import { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/lib/siteConfig';

interface CalEmbedProps {
  calLink?: string;
}

export default function CalEmbed({ calLink = siteConfig.calBookingUrl ?? '' }: CalEmbedProps) {
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !calLink) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [calLink]);

  useEffect(() => {
    if (!inView || !calLink) return;
    getCalApi().then((cal) => {
      cal('ui', {
        theme: 'dark',
        styles: { branding: { brandColor: '#C5A572' } },
        hideEventTypeDetails: false,
      });
      setReady(true);
    });
  }, [inView, calLink]);

  if (!calLink) {
    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-3 border border-steel-200 bg-white p-10 text-center">
        <p className="font-sans text-base font-medium text-steel-900">
          Online booking is opening shortly.
        </p>
        <p className="max-w-md font-sans text-sm leading-relaxed text-steel-600">
          To request your Strategy Consultation now, send a brief using the form below and Laith
          will reply within one business day from Amman.
        </p>
      </div>
    );
  }

  return (
    <div ref={sentinelRef} className="relative min-h-[720px] w-full">
      {!ready && <div className="absolute inset-0 animate-pulse bg-[#0e1116]" aria-hidden="true" />}
      {inView && (
        <Cal
          calLink={calLink}
          style={{ width: '100%', height: '720px', overflow: 'scroll' }}
          config={{ layout: 'month_view' }}
        />
      )}
    </div>
  );
}
