'use client';

import { useState, useTransition } from 'react';

import { decideAccessRequest, type AccessRequest } from '@/app/actions/access/admin';

export default function AccessRequestsClient({ initial }: { initial: AccessRequest[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function decide(id: string, decision: 'invited' | 'declined') {
    setError('');
    startTransition(async () => {
      const res = await decideAccessRequest({ id, decision });
      if (!res.success) {
        setError(res.error);
        return;
      }
      setRows((r) => r.filter((row) => row.id !== id));
    });
  }

  if (rows.length === 0) {
    return <p className="font-sans text-sm text-steel-500">No pending access requests.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="font-sans text-sm text-alert-500">{error}</p>}
      {rows.map((r) => (
        <div key={r.id} className="rounded-card border border-steel-200 bg-white p-5 shadow-a1-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-sans text-base font-semibold text-steel-900">
                  {r.organizationName}
                </h3>
                <span className="rounded-pill bg-bayty-50 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-bayty-600">
                  {r.organizationType}
                </span>
              </div>
              <p className="mt-1 font-sans text-sm text-steel-600">
                {r.contactName} · {r.email}
                {r.phone ? ` · ${r.phone}` : ''}
              </p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-widest text-steel-500">
                {r.country}
                {r.programName ? ` · ${r.programName}` : ''}
                {r.programScale ? ` · ${r.programScale}` : ''}
                {` · ${new Date(r.createdAt).toLocaleDateString()}`}
              </p>
              {r.website && (
                <a
                  href={r.website.startsWith('http') ? r.website : `https://${r.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block font-sans text-xs text-bayty-600 underline"
                >
                  {r.website}
                </a>
              )}
              {r.message && (
                <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-steel-600">
                  “{r.message}”
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => decide(r.id, 'invited')}
                className="rounded-pill bg-success-500 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-white disabled:opacity-40"
              >
                Invite
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => decide(r.id, 'declined')}
                className="rounded-pill border border-steel-300 px-4 py-2 font-mono text-[11px] uppercase tracking-widest text-steel-600 disabled:opacity-40"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
