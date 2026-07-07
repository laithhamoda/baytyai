'use client';

import { Printer } from 'lucide-react';

/** Fixed, non-printing action to trigger the browser's Save-as-PDF dialog. */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-sm bg-[#0A1628] px-5 py-3 font-sans text-sm font-medium text-white shadow-lg transition-colors hover:bg-[#17284a]"
    >
      <Printer size={16} /> Print / Save as PDF
    </button>
  );
}
