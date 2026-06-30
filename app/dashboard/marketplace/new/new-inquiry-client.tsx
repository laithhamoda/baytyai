'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { createInquiry } from '@/app/actions/inquiries/create';

const REGIONS = ['', 'Global', 'Middle East', 'Europe', 'North America', 'Asia', 'Africa'];
const BUDGETS = ['', '< $50k', '$50k–$250k', '$250k–$1M', '$1M–$10M', '> $10M'];

export default function NewInquiryClient() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [region, setRegion] = useState('');
  const [budgetBand, setBudgetBand] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function submit() {
    setError('');
    if (title.trim().length < 3) {
      setError('Title must be at least 3 characters.');
      return;
    }
    startTransition(async () => {
      const res = await createInquiry({
        title: title.trim(),
        description: description.trim(),
        region: region || undefined,
        budgetBand: budgetBand || undefined,
      });
      if (!res.success) {
        setError(res.error);
        return;
      }
      router.push('/dashboard/marketplace');
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">Title</span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. MEP design consultant for a mixed-use tower"
          className="border border-ink-700 bg-ink-950 px-3 py-2 font-sans text-sm text-ink-100"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
          Description
        </span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          placeholder="Scope, deliverables, timeline, location…"
          className="border border-ink-700 bg-ink-950 px-3 py-2 font-sans text-sm text-ink-100"
        />
      </label>
      <div className="flex gap-3">
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
            Region
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="border border-ink-700 bg-ink-950 px-3 py-2 font-sans text-sm text-ink-100"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r || 'Unspecified'}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-1 flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
            Budget band
          </span>
          <select
            value={budgetBand}
            onChange={(e) => setBudgetBand(e.target.value)}
            className="border border-ink-700 bg-ink-950 px-3 py-2 font-sans text-sm text-ink-100"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b || 'Unspecified'}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={submit}
          disabled={pending}
          className="bg-signal-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-950 disabled:opacity-40"
        >
          {pending ? 'Posting…' : 'Post inquiry'}
        </button>
        {error && <span className="font-sans text-sm text-alert-500">{error}</span>}
      </div>
    </div>
  );
}
