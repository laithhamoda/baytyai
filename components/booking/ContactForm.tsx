'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid work email required'),
  company: z.string().min(2, 'Company name is required'),
  role: z.enum(['CEO', 'COO', 'Operations Director', 'Commercial Director', 'Other'], {
    error: 'Role is required',
  }),
  contractSize: z.enum(['< $5M', '$5–25M', '$25–100M', '> $100M'], {
    error: 'Contract size is required',
  }),
  message: z.string().min(1, 'Message is required'),
});

type FormValues = z.infer<typeof schema>;

const ROLES = ['CEO', 'COO', 'Operations Director', 'Commercial Director', 'Other'] as const;
const CONTRACT_SIZES = ['< $5M', '$5–25M', '$25–100M', '> $100M'] as const;

const inputCls =
  'w-full border border-[#21262d] bg-[#0e1116] px-4 py-3 text-sm text-[#e6e9ee] placeholder:text-[#6e7681] focus:border-[#c5a572]/60 focus:outline-none';
const errorCls = 'mt-1 text-xs text-red-400';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormValues) {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Delivery failed');
      setStatus('success');
      reset();
    } catch {
      setStatus('error');
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <label htmlFor="cf-name" className="sr-only">
          Full name
        </label>
        <input id="cf-name" {...register('name')} placeholder="Full name" className={inputCls} />
        {errors.name && <p className={errorCls}>{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-email" className="sr-only">
          Work email
        </label>
        <input
          id="cf-email"
          {...register('email')}
          type="email"
          placeholder="Work email"
          className={inputCls}
        />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-company" className="sr-only">
          Company
        </label>
        <input
          id="cf-company"
          {...register('company')}
          placeholder="Company"
          className={inputCls}
        />
        {errors.company && <p className={errorCls}>{errors.company.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-role" className="sr-only">
          Your role
        </label>
        <select id="cf-role" {...register('role')} className={inputCls} defaultValue="">
          <option value="" disabled>
            Your role
          </option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.role && <p className={errorCls}>{errors.role.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-contractSize" className="sr-only">
          Contract size band
        </label>
        <select
          id="cf-contractSize"
          {...register('contractSize')}
          className={inputCls}
          defaultValue=""
        >
          <option value="" disabled>
            Contract size band
          </option>
          {CONTRACT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        {errors.contractSize && <p className={errorCls}>{errors.contractSize.message}</p>}
      </div>
      <div>
        <label htmlFor="cf-message" className="sr-only">
          Message
        </label>
        <textarea
          id="cf-message"
          {...register('message')}
          placeholder="What's the contract and the pain?"
          rows={4}
          className={inputCls}
        />
        {errors.message && <p className={errorCls}>{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 border border-[#c5a572] bg-[#c5a572] px-8 py-4 text-sm font-medium uppercase tracking-widest text-[#07090c] transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Request Strategy Call'}
      </button>

      {status === 'success' && (
        <p className="text-center text-sm text-[#c5a572]">
          Received. Laith will reply within one business day from Amman.
        </p>
      )}
      {status === 'error' && (
        <p className="text-center text-sm text-red-400">
          Something went wrong. Email{' '}
          <a href="mailto:laithrhamoda@gmail.com" className="underline">
            laithrhamoda@gmail.com
          </a>{' '}
          directly.
        </p>
      )}
    </form>
  );
}
