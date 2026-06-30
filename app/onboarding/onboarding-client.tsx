'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

import { completeOnboarding } from '@/app/actions/onboarding/complete-onboarding';

const TYPES: { value: string; label: string; blurb: string }[] = [
  { value: 'client', label: 'Client / Owner', blurb: 'I commission projects and award work.' },
  { value: 'consultant', label: 'Consultant', blurb: 'I advise, design, and review.' },
  { value: 'contractor', label: 'Contractor', blurb: 'I deliver projects and bid for work.' },
  { value: 'subcontractor', label: 'Subcontractor', blurb: 'I deliver specialist scopes.' },
  { value: 'supplier', label: 'Supplier', blurb: 'I supply materials and equipment.' },
];

export default function OnboardingClient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Organization name is required.');
    if (!type) return setError('Please choose your role.');
    startTransition(async () => {
      const res = await completeOnboarding({ name: name.trim(), stakeholderType: type });
      if (!res.success) {
        setError(res.error);
        return;
      }
      router.push('/dashboard');
      router.refresh();
    });
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-8">
      <div>
        <label
          htmlFor="org-name"
          className="mb-2 block font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500"
        >
          Organization name
        </label>
        <input
          id="org-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Acme Construction Ltd."
          className="w-full border border-ink-700 bg-ink-900 px-4 py-3 text-sm text-ink-100 placeholder:text-ink-500 focus:border-signal-500 focus:outline-none"
        />
      </div>

      <fieldset>
        <legend className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink-500">
          Your role
        </legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`cursor-pointer border p-4 transition-colors ${
                type === t.value
                  ? 'border-signal-500 bg-ink-900'
                  : 'border-ink-700 bg-ink-950 hover:border-ink-500'
              }`}
            >
              <input
                type="radio"
                name="stakeholderType"
                value={t.value}
                checked={type === t.value}
                onChange={() => setType(t.value)}
                className="sr-only"
              />
              <span className="block font-sans text-sm font-semibold text-ink-100">{t.label}</span>
              <span className="mt-1 block font-sans text-xs text-ink-300">{t.blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="font-sans text-sm text-alert-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-14 w-full bg-signal-500 font-sans text-sm font-medium uppercase tracking-[0.14em] text-ink-950 transition-colors hover:bg-signal-600 disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create organization'}
      </button>
    </form>
  );
}
