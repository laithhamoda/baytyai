'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';

import { listPublishedInquiries, type InquiryListItem } from '@/app/actions/marketplace/browse';

const REGIONS = ['', 'Global', 'Middle East', 'Europe', 'North America', 'Asia', 'Africa'];
const BUDGETS = ['', '< $50k', '$50k–$250k', '$250k–$1M', '$1M–$10M', '> $10M'];

export default function MarketplaceClient({
  initial,
  canQuote,
}: {
  initial: InquiryListItem[];
  canQuote: boolean;
}) {
  const [items, setItems] = useState(initial);
  const [q, setQ] = useState('');
  const [region, setRegion] = useState('');
  const [budgetBand, setBudgetBand] = useState('');
  const [pending, startTransition] = useTransition();

  function applyFilters() {
    startTransition(async () => {
      const res = await listPublishedInquiries({
        q: q || undefined,
        region: region || undefined,
        budgetBand: budgetBand || undefined,
      });
      if (res.success) setItems(res.data);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 rounded-card border border-steel-200 bg-white p-4 shadow-a1-sm">
        <label className="flex min-w-[200px] flex-1 flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Search
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder="Title or description…"
            className="rounded-card border border-steel-300 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Region
          </span>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="rounded-card border border-steel-300 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          >
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r || 'Any'}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Budget
          </span>
          <select
            value={budgetBand}
            onChange={(e) => setBudgetBand(e.target.value)}
            className="rounded-card border border-steel-300 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          >
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b || 'Any'}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={applyFilters}
          disabled={pending}
          className="border border-bayty-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-bayty-600 disabled:opacity-40"
        >
          {pending ? 'Filtering…' : 'Apply'}
        </button>
      </div>

      {/* Results */}
      {items.length === 0 ? (
        <p className="font-sans text-sm text-steel-500">No inquiries match your filters.</p>
      ) : (
        <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {items.map((it) => (
            <li key={it.id}>
              <Link
                href={`/dashboard/marketplace/${it.id}`}
                className="flex h-full flex-col gap-2 rounded-card border border-steel-200 bg-white p-5 shadow-a1-sm transition-colors hover:border-bayty-300"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-sans text-base font-medium text-steel-900">{it.title}</h3>
                  {it.isOwn && (
                    <span className="shrink-0 font-mono text-[9px] uppercase tracking-widest text-bayty-600">
                      Yours
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 font-sans text-sm text-steel-500">{it.description}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {it.region && (
                    <span className="border border-steel-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-steel-500">
                      {it.region}
                    </span>
                  )}
                  {it.budgetBand && (
                    <span className="border border-steel-200 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-steel-500">
                      {it.budgetBand}
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {!canQuote && (
        <p className="font-sans text-xs text-steel-500">
          Verification is required to submit a quotation on any inquiry.
        </p>
      )}
    </div>
  );
}
