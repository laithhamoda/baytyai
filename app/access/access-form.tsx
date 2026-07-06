'use client';

import { useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';

import { submitAccessRequest } from '@/app/actions/access/submit';

const ORG_TYPES = [
  { value: 'government', label: 'Government / Public authority' },
  { value: 'owner-developer', label: 'Owner / Mega-developer' },
  { value: 'consultant', label: 'Lead consultant' },
  { value: 'contractor', label: 'Contractor (tier-1)' },
  { value: 'subcontractor', label: 'Subcontractor' },
  { value: 'supplier', label: 'Strategic supplier' },
] as const;

type OrgType = (typeof ORG_TYPES)[number]['value'];

// Maps the ?role= value carried by the audience-page CTAs to an org type.
const ROLE_TO_ORG_TYPE: Record<string, OrgType> = {
  client: 'owner-developer',
  owner: 'owner-developer',
  consultant: 'consultant',
  contractor: 'contractor',
  subcontractor: 'subcontractor',
  supplier: 'supplier',
  government: 'government',
};

const SCALES = ['', '< $100M', '$100M–$500M', '$500M–$1B', '$1B–$5B', '> $5B'];

const inputCls =
  'w-full rounded-card border border-steel-300 bg-white px-4 py-3 text-sm text-steel-900 placeholder:text-steel-400 focus:border-bayty-500 focus:outline-none focus:ring-2 focus:ring-bayty-500/20';
const labelCls = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500';

function Field({
  label,
  optional,
  className,
  children,
}: {
  label: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className ?? ''}`}>
      <span className={labelCls}>
        {label} {optional && <span className="normal-case text-steel-400">(optional)</span>}
      </span>
      {children}
    </label>
  );
}

export default function AccessForm() {
  const startedAt = useRef(Date.now());
  const roleParam = useSearchParams().get('role');
  const presetType = roleParam ? (ROLE_TO_ORG_TYPE[roleParam.toLowerCase()] ?? '') : '';
  const [f, setF] = useState({
    organizationName: '',
    organizationType: presetType as OrgType | '',
    contactName: '',
    email: '',
    country: '',
    phone: '',
    website: '',
    programName: '',
    programScale: '',
    message: '',
  });
  const [honeypot, setHoneypot] = useState('');
  const [human, setHuman] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  function set<K extends keyof typeof f>(k: K, v: string) {
    setF((s) => ({ ...s, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!human) return setError('Please confirm you are human first.');
    setBusy(true);
    const res = await submitAccessRequest({
      ...f,
      organizationType: f.organizationType as (typeof ORG_TYPES)[number]['value'],
      website2: honeypot,
      elapsedMs: Date.now() - startedAt.current,
    });
    setBusy(false);
    if (!res.success) return setError(res.error);
    setDone(true);
  }

  if (done) {
    return (
      <div className="rounded-card border border-forest-400/30 bg-forest-50 p-8 text-center">
        <h2 className="font-display text-2xl font-bold text-steel-900">Request received</h2>
        <p className="mt-3 font-sans text-sm leading-relaxed text-steel-600">
          Thank you. Our team reviews every application manually. If your organization is a fit,
          we’ll reach out with an invitation to onboard.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-6 text-left">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field label="Organization name" className="sm:col-span-2">
          <input
            required
            value={f.organizationName}
            onChange={(e) => set('organizationName', e.target.value)}
            placeholder="e.g. National Development Authority"
            className={inputCls}
          />
        </Field>
        <Field label="Organization type">
          <select
            required
            value={f.organizationType}
            onChange={(e) => set('organizationType', e.target.value)}
            className={inputCls}
          >
            <option value="">Select…</option>
            {ORG_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Country">
          <input
            required
            value={f.country}
            onChange={(e) => set('country', e.target.value)}
            placeholder="United Arab Emirates"
            className={inputCls}
          />
        </Field>
        <Field label="Contact name">
          <input
            required
            value={f.contactName}
            onChange={(e) => set('contactName', e.target.value)}
            placeholder="Full name"
            className={inputCls}
          />
        </Field>
        <Field label="Work email">
          <input
            required
            type="email"
            value={f.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="you@organization.gov"
            className={inputCls}
          />
        </Field>
        <Field label="Phone" optional>
          <input
            value={f.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="+971 …"
            className={inputCls}
          />
        </Field>
        <Field label="Website" optional>
          <input
            value={f.website}
            onChange={(e) => set('website', e.target.value)}
            placeholder="https://…"
            className={inputCls}
          />
        </Field>
        <Field label="Flagship program" optional>
          <input
            value={f.programName}
            onChange={(e) => set('programName', e.target.value)}
            placeholder="Program / project name"
            className={inputCls}
          />
        </Field>
        <Field label="Program scale" optional>
          <select
            value={f.programScale}
            onChange={(e) => set('programScale', e.target.value)}
            className={inputCls}
          >
            {SCALES.map((s) => (
              <option key={s} value={s}>
                {s || 'Select…'}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Anything else" optional className="sm:col-span-2">
          <textarea
            rows={3}
            value={f.message}
            onChange={(e) => set('message', e.target.value)}
            placeholder="Tell us briefly about your program and what you need."
            className={inputCls}
          />
        </Field>
      </div>

      {/* Honeypot */}
      <input
        type="text"
        name="website2"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="absolute left-[-9999px] size-0 opacity-0"
      />

      <label className="flex cursor-pointer items-center gap-3 rounded-card border border-steel-200 bg-white px-4 py-3">
        <input
          type="checkbox"
          checked={human}
          onChange={(e) => setHuman(e.target.checked)}
          className="size-4 accent-bayty-500"
        />
        <span className="font-sans text-sm text-steel-700">I’m a human, not a robot</span>
      </label>

      {error && (
        <p role="alert" className="font-sans text-sm text-alert-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || !human}
        className="h-14 w-full rounded-pill bg-orange-400 font-sans text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-a1-glow transition-colors hover:bg-orange-600 disabled:opacity-50"
      >
        {busy ? 'Submitting…' : 'Submit request'}
      </button>
      <p className="text-center font-sans text-xs text-steel-500">
        Reviewed manually · verified organizations only · we’ll contact qualifying applicants
      </p>
    </form>
  );
}
