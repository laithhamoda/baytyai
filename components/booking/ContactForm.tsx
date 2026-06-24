'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid work email required'),
  company: z.string().min(2, 'Company name is required'),
  contractValue: z.string().min(1, 'Contract value range is required'),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const CONTRACT_RANGES = ['$5M – $20M', '$20M – $100M', '$100M – $500M', '$500M+'];

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

  const inputCls =
    'w-full border border-gold/20 bg-navy/60 px-4 py-3 text-sm text-offwhite placeholder:text-offwhite/30 focus:border-gold/60 focus:outline-none';
  const errorCls = 'mt-1 text-xs text-red-400';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div>
        <input {...register('name')} placeholder="Full name" className={inputCls} />
        {errors.name && <p className={errorCls}>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register('email')} type="email" placeholder="Work email" className={inputCls} />
        {errors.email && <p className={errorCls}>{errors.email.message}</p>}
      </div>
      <div>
        <input {...register('company')} placeholder="Company" className={inputCls} />
        {errors.company && <p className={errorCls}>{errors.company.message}</p>}
      </div>
      <div>
        <select {...register('contractValue')} className={inputCls} defaultValue="">
          <option value="" disabled>
            Contract value range
          </option>
          {CONTRACT_RANGES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        {errors.contractValue && <p className={errorCls}>{errors.contractValue.message}</p>}
      </div>
      <div>
        <textarea
          {...register('message')}
          placeholder="What's the contract and the pain? (optional)"
          rows={4}
          className={inputCls}
        />
      </div>

      <button
        type="submit"
        disabled={status === 'loading'}
        className="mt-2 border border-gold bg-gold px-8 py-4 text-sm font-medium uppercase tracking-widest text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {status === 'loading' ? 'Sending…' : 'Request Strategy Call'}
      </button>

      {status === 'success' && (
        <p className="text-center text-sm text-gold">
          Request received. Laith will reply within 24 hours.
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
