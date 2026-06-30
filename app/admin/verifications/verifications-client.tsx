'use client';

import { useState, useTransition } from 'react';

import { decideVerification, type PendingVerification } from '@/app/actions/verification/admin';

export default function VerificationsClient({ initial }: { initial: PendingVerification[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function decide(orgId: string, decision: 'verified' | 'rejected') {
    setError('');
    let notes: string | undefined;
    if (decision === 'rejected') {
      notes = window.prompt('Reason for rejection?') ?? '';
      if (!notes.trim()) {
        setError('A reason is required to reject.');
        return;
      }
    }
    startTransition(async () => {
      const res = await decideVerification({ orgId, decision, notes });
      if (!res.success) {
        setError(res.error);
        return;
      }
      setRows((r) => r.filter((row) => row.orgId !== orgId));
    });
  }

  if (rows.length === 0) {
    return (
      <p className="font-sans text-sm text-ink-500">No organizations awaiting verification.</p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="font-sans text-sm text-alert-500">{error}</p>}
      {rows.map((row) => (
        <div
          key={row.orgId}
          className="flex flex-col gap-3 border border-ink-700 bg-ink-900 p-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-sans text-sm font-medium text-ink-100">{row.name}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-500">
              {row.stakeholderType}
              {row.requestedAt
                ? ` · requested ${new Date(row.requestedAt).toLocaleDateString()}`
                : ''}
            </p>
            {row.notes && (
              <p className="mt-2 max-w-xl font-sans text-xs leading-relaxed text-ink-300">
                “{row.notes}”
              </p>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(row.orgId, 'verified')}
              className="bg-success-500 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-ink-950 disabled:opacity-40"
            >
              Verify
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(row.orgId, 'rejected')}
              className="border border-alert-500 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-alert-500 disabled:opacity-40"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
