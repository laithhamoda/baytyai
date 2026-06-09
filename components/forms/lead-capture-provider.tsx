'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import LeadCaptureForm from './LeadCaptureForm';

import type { InquiryType } from '@/app/actions/lead-schema';

interface LeadCaptureContextValue {
  open: (inquiryType: InquiryType) => void;
}

const LeadCaptureContext = createContext<LeadCaptureContextValue | null>(null);

export function useLeadCapture(): LeadCaptureContextValue {
  const ctx = useContext(LeadCaptureContext);
  if (!ctx) throw new Error('useLeadCapture must be used within LeadCaptureProvider');
  return ctx;
}

export default function LeadCaptureProvider({ children }: { children: React.ReactNode }) {
  const [inquiry, setInquiry] = useState<InquiryType | null>(null);

  const open = useCallback((inquiryType: InquiryType) => setInquiry(inquiryType), []);
  const close = useCallback(() => setInquiry(null), []);

  useEffect(() => {
    if (!inquiry) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [inquiry, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <LeadCaptureContext.Provider value={value}>
      {children}

      {inquiry && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          style={{ overflowY: 'auto' }}
        >
          {/* Backdrop — real button for keyboard accessibility */}
          <button
            type="button"
            aria-label="Close form"
            onClick={close}
            className="absolute inset-0"
            style={{ backgroundColor: 'rgba(10,22,40,0.8)', border: 'none', cursor: 'pointer' }}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Lead capture form"
            className="relative w-full"
            style={{
              maxWidth: '480px',
              backgroundColor: '#F8F6F1',
              padding: '40px',
              borderRadius: 0,
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: '14px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '20px',
                lineHeight: 1,
                color: 'rgba(10,22,40,0.5)',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <LeadCaptureForm inquiryType={inquiry} onClose={close} />
          </div>
        </div>
      )}
    </LeadCaptureContext.Provider>
  );
}
