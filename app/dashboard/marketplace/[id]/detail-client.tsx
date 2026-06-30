'use client';

import { useState, useTransition } from 'react';

import { submitQuotation } from '@/app/actions/quotations/submit';

import type { InquiryDetail } from '@/app/actions/marketplace/browse';

export default function InquiryDetailClient({
  inquiry,
  canQuote,
}: {
  inquiry: InquiryDetail;
  canQuote: boolean;
}) {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [notes, setNotes] = useState('');
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  function submit() {
    setMessage(null);
    const value = Number(amount);
    if (!value || value <= 0) {
      setMessage({ kind: 'err', text: 'Enter a valid amount.' });
      return;
    }
    startTransition(async () => {
      const res = await submitQuotation({
        inquiryId: inquiry.id,
        amount: value,
        currency,
        notes,
      });
      if (!res.success) {
        setMessage({ kind: 'err', text: res.error });
        return;
      }
      setMessage({ kind: 'ok', text: 'Quotation submitted.' });
      setAmount('');
      setNotes('');
    });
  }

  // Inquiry owner: show received quotations instead of a submit form.
  if (inquiry.isOwn) {
    return (
      <section>
        <h2 className="mb-4 font-sans text-lg font-semibold text-steel-900">
          Quotations received ({inquiry.quotations.length})
        </h2>
        {inquiry.quotations.length === 0 ? (
          <p className="font-sans text-sm text-steel-500">No quotations yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {inquiry.quotations.map((q) => (
              <li
                key={q.id}
                className="flex items-start justify-between gap-4 rounded-card border border-steel-200 bg-white p-4 shadow-a1-sm"
              >
                <div>
                  <p className="font-mono text-sm text-steel-900">
                    {q.currency} {q.amount.toLocaleString()}
                  </p>
                  {q.notes && <p className="mt-1 font-sans text-sm text-steel-500">{q.notes}</p>}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
                  {q.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  }

  return (
    <section className="rounded-card border border-steel-200 bg-white p-6 shadow-a1-sm">
      <h2 className="mb-4 font-sans text-lg font-semibold text-steel-900">Submit a quotation</h2>
      {!canQuote ? (
        <p className="font-sans text-sm text-steel-600">
          Your organization must be verified before submitting quotations.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <label className="flex flex-1 flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
                Amount
              </span>
              <input
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-card border border-steel-300 bg-white px-3 py-2 font-mono text-sm text-steel-900"
              />
            </label>
            <label className="flex w-28 flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
                Currency
              </span>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="rounded-card border border-steel-300 bg-white px-3 py-2 font-sans text-sm text-steel-900"
              >
                {['USD', 'EUR', 'GBP', 'AED', 'SAR'].map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
              Notes
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Scope, timeline, assumptions…"
              className="rounded-card border border-steel-300 bg-white px-3 py-2 font-sans text-sm text-steel-900"
            />
          </label>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="rounded-pill bg-bayty-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-white disabled:opacity-40"
            >
              {pending ? 'Submitting…' : 'Submit quotation'}
            </button>
            {message && (
              <span
                className={`font-sans text-sm ${message.kind === 'ok' ? 'text-success-500' : 'text-alert-500'}`}
              >
                {message.text}
              </span>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
