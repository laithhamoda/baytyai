'use client';

import { useState } from 'react';

import type { TorDraft } from '@/lib/consultant-selection/tor';

const COMPLEXITIES = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'mega', label: 'Mega' },
] as const;

const METHODS = ['QBS', 'QCBS', 'LCS', 'FBS', 'SSS'] as const;

export default function TorStudio() {
  const [projectTitle, setProjectTitle] = useState('');
  const [scope, setScope] = useState('');
  const [complexity, setComplexity] = useState<'commercial' | 'mega'>('commercial');
  const [selectionMethod, setSelectionMethod] = useState<string>('QCBS');
  const [objectives, setObjectives] = useState('');
  const [country, setCountry] = useState('');

  const [draft, setDraft] = useState<TorDraft | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function draftTor() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/selection/tor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectTitle,
          scope,
          complexity,
          selectionMethod,
          objectives,
          country,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || 'Could not draft the TOR. Please try again.');
        return;
      }
      setDraft(json.draft as TorDraft);
    } catch {
      setError('Network error while drafting the TOR.');
    } finally {
      setLoading(false);
    }
  }

  const canDraft = projectTitle.trim().length > 0 && scope.trim().length > 0 && !loading;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 border border-steel-200 bg-steel-50 p-6 sm:grid-cols-2">
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Project title
          </span>
          <input
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            placeholder="e.g. Riverside Commercial Tower — Design & Supervision"
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Complexity
          </span>
          <select
            value={complexity}
            onChange={(e) => setComplexity(e.target.value as 'commercial' | 'mega')}
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          >
            {COMPLEXITIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Selection method
          </span>
          <select
            value={selectionMethod}
            onChange={(e) => setSelectionMethod(e.target.value)}
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          >
            {METHODS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Country (optional)
          </span>
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. United Arab Emirates"
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Objectives (one per line, optional)
          </span>
          <input
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="Deliver detailed design; Supervise construction"
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          />
        </label>

        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Scope / background
          </span>
          <textarea
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            rows={4}
            placeholder="Describe the project, its drivers, and the services required from the consultant."
            className="border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900"
          />
        </label>

        <div className="flex items-center gap-4 sm:col-span-2">
          <button
            type="button"
            onClick={draftTor}
            disabled={!canDraft}
            className="bg-bayty-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-white disabled:opacity-40"
          >
            {loading ? 'Drafting…' : 'Draft TOR (AI)'}
          </button>
          {error && <span className="font-sans text-sm text-alert-500">{error}</span>}
        </div>
      </div>

      {draft && (
        <article className="border border-steel-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-sans text-lg font-semibold text-steel-900">{draft.title}</h3>
            <span
              className="font-mono text-[10px] uppercase tracking-widest text-steel-500"
              title={
                draft.source === 'ai'
                  ? 'Generated by Claude (claude-opus-4-8).'
                  : 'Generated from a built-in template (no API key configured).'
              }
            >
              {draft.source === 'ai' ? '✦ AI draft' : '◇ Template draft'}
            </span>
          </div>
          <div className="flex flex-col gap-5">
            {draft.sections.map((s) => (
              <section key={s.heading}>
                <h4 className="mb-1 font-sans text-sm font-semibold text-bayty-600">{s.heading}</h4>
                <p className="whitespace-pre-line font-sans text-sm leading-relaxed text-steel-600">
                  {s.body}
                </p>
              </section>
            ))}
          </div>
          <p className="mt-5 font-sans text-xs text-steel-500">
            This is a draft. Review, edit, and approve it before it is version-locked and released
            to consultants.
          </p>
        </article>
      )}
    </div>
  );
}
