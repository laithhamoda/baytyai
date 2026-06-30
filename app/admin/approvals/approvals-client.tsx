'use client';

import { useState, useTransition } from 'react';

import { decideApproval } from '@/app/actions/approvals/decide';

import type { ApprovalRow } from '@/app/actions/approvals/list';

export default function ApprovalsClient({ initial }: { initial: ApprovalRow[] }) {
  const [rows, setRows] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState('');

  function decide(id: string, decision: 'approved' | 'rejected') {
    setError('');
    let reason: string | undefined;
    if (decision === 'rejected') {
      reason = window.prompt('Reason for rejection?') ?? '';
      if (!reason.trim()) {
        setError('A reason is required to reject.');
        return;
      }
    }
    startTransition(async () => {
      const res = await decideApproval({ approvalId: id, decision, reason });
      if (!res.success) {
        setError(res.error);
        return;
      }
      setRows((r) => r.filter((row) => row.id !== id));
    });
  }

  if (rows.length === 0) {
    return <p className="font-sans text-sm text-steel-500">No pending approvals.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {error && <p className="font-sans text-sm text-alert-500">{error}</p>}
      {rows.map((row) => (
        <div
          key={row.id}
          className="flex items-center justify-between border border-steel-200 bg-white p-4"
        >
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-bayty-600">
              {row.entity_type}
            </p>
            <p className="font-sans text-sm text-steel-600">{row.entity_id}</p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(row.id, 'approved')}
              className="bg-success-500 px-4 py-2 font-sans text-xs font-medium text-white disabled:opacity-50"
            >
              Approve
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => decide(row.id, 'rejected')}
              className="border border-alert-500 px-4 py-2 font-sans text-xs font-medium text-alert-500 disabled:opacity-50"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
