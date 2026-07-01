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

const inputCls =
  'w-full rounded-card border border-steel-300 bg-white px-4 py-3 text-sm text-steel-900 placeholder:text-steel-400 focus:border-bayty-500 focus:outline-none focus:ring-2 focus:ring-bayty-500/20';
const labelCls = 'mb-1.5 block font-mono text-[10px] uppercase tracking-[0.16em] text-steel-500';

export default function OnboardingClient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [country, setCountry] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [website, setWebsite] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('Organization name is required.');
    if (!type) return setError('Please choose your role.');
    if (!country.trim()) return setError('Country is required.');
    if (!registrationNumber.trim())
      return setError('Company registration / trade-license number is required.');
    startTransition(async () => {
      const res = await completeOnboarding({
        name: name.trim(),
        stakeholderType: type,
        country: country.trim(),
        registrationNumber: registrationNumber.trim(),
        website: website.trim(),
        contactName: contactName.trim(),
        phone: phone.trim(),
      });
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
      {/* Role */}
      <fieldset>
        <legend className={labelCls}>Your role</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TYPES.map((t) => (
            <label
              key={t.value}
              className={`cursor-pointer rounded-card border p-4 transition-colors ${
                type === t.value
                  ? 'border-bayty-500 bg-bayty-50'
                  : 'border-steel-200 bg-white hover:border-bayty-300'
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
              <span className="block font-sans text-sm font-semibold text-steel-900">
                {t.label}
              </span>
              <span className="mt-1 block font-sans text-xs text-steel-500">{t.blurb}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {/* Company details */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="org-name" className={labelCls}>
            Organization / company name
          </label>
          <input
            id="org-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Acme Construction Ltd."
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="country" className={labelCls}>
            Country
          </label>
          <input
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="United Arab Emirates"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="reg" className={labelCls}>
            Registration / trade-license no.
          </label>
          <input
            id="reg"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value)}
            placeholder="e.g. CN-1234567"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="website" className={labelCls}>
            Website <span className="normal-case text-steel-400">(optional)</span>
          </label>
          <input
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://company.com"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="contact" className={labelCls}>
            Contact person <span className="normal-case text-steel-400">(optional)</span>
          </label>
          <input
            id="contact"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            placeholder="Full name"
            className={inputCls}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="phone" className={labelCls}>
            Phone <span className="normal-case text-steel-400">(optional)</span>
          </label>
          <input
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+971 …"
            className={inputCls}
          />
        </div>
      </div>

      <p className="rounded-card border border-bayty-200 bg-bayty-50 px-4 py-3 font-sans text-xs leading-relaxed text-steel-600">
        These details are used to <strong>manually verify your organization</strong>. You’ll get
        access to the dashboard right away; posting inquiries and submitting quotations unlock once
        our team approves your verification.
      </p>

      {error && (
        <p role="alert" className="font-sans text-sm text-alert-500">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="h-14 w-full rounded-pill bg-bayty-500 font-sans text-sm font-medium uppercase tracking-[0.14em] text-white transition-colors hover:bg-bayty-600 disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create organization & request verification'}
      </button>
    </form>
  );
}
