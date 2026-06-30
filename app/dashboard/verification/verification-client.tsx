'use client';

import { useState, useTransition } from 'react';

import { requestVerification, type VerificationState } from '@/app/actions/verification/request';

const STATUS_META: Record<
  VerificationState['status'],
  { label: string; cls: string; blurb: string }
> = {
  unverified: {
    label: 'Unverified',
    cls: 'text-ink-400 border-ink-700',
    blurb: 'Your organization is not yet verified. Request verification to unlock the marketplace.',
  },
  pending: {
    label: 'Pending review',
    cls: 'text-signal-500 border-signal-500/40',
    blurb: 'Your request is in the queue. The BaytyAI team will review it manually.',
  },
  verified: {
    label: 'Verified',
    cls: 'text-success-500 border-success-500/40',
    blurb: 'Your organization is verified and can transact in the marketplace.',
  },
  rejected: {
    label: 'Rejected',
    cls: 'text-alert-500 border-alert-500/40',
    blurb: 'Your previous request was not approved. Review the note below and re-submit.',
  },
};

export default function VerificationClient({ initial }: { initial: VerificationState }) {
  const [state, setState] = useState(initial);
  const [notes, setNotes] = useState('');
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const meta = STATUS_META[state.status];
  const canRequest = state.status === 'unverified' || state.status === 'rejected';

  function submit() {
    setError('');
    startTransition(async () => {
      const res = await requestVerification(notes);
      if (!res.success) {
        setError(res.error);
        return;
      }
      setState((s) => ({ ...s, status: 'pending', requestedAt: new Date().toISOString() }));
      setNotes('');
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className={`border ${meta.cls} bg-ink-900 p-6`}>
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] uppercase tracking-widest">Status</span>
          <span className={`font-mono text-sm uppercase tracking-widest ${meta.cls.split(' ')[0]}`}>
            ● {meta.label}
          </span>
        </div>
        <p className="mt-3 font-sans text-sm leading-relaxed text-ink-300">{meta.blurb}</p>
        {state.verifiedAt && (
          <p className="mt-2 font-mono text-[11px] text-ink-500">
            Verified {new Date(state.verifiedAt).toLocaleDateString()}
          </p>
        )}
        {state.status === 'rejected' && state.notes && (
          <p className="mt-3 border-l-2 border-alert-500 pl-3 font-sans text-sm text-ink-300">
            Reviewer note: {state.notes}
          </p>
        )}
      </div>

      {canRequest && (
        <div className="border border-ink-700 bg-ink-950 p-6">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-ink-500">
              Anything the reviewer should know (optional)
            </span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Company registration no., trade license, website, references…"
              className="border border-ink-700 bg-ink-900 px-3 py-2 font-sans text-sm text-ink-100"
            />
          </label>
          <div className="mt-4 flex items-center gap-4">
            <button
              type="button"
              onClick={submit}
              disabled={pending}
              className="bg-signal-500 px-5 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-950 disabled:opacity-40"
            >
              {pending ? 'Submitting…' : 'Request verification'}
            </button>
            {error && <span className="font-sans text-sm text-alert-500">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}
