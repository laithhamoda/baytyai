'use client';

import { FileSignature, Loader2, Sparkles, ChevronDown, Printer, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export type ProjectOption = { id: string; label: string };

type DocType =
  | 'rfi'
  | 'engineers_instruction'
  | 'material_submittal'
  | 'local_purchase_order'
  | 'interim_payment_application'
  | 'variation_order_request';

export type GeneratedDocRow = {
  id: string;
  doc_type: DocType;
  reference_no: string;
  title: string;
  status: string;
  source: 'ai' | 'template';
  language: 'en' | 'ar';
  fidic_clause: string | null;
  body: { sections: { heading: string; body: string }[] } | null;
  created_at: string;
};

const DOC_TYPES: { value: DocType; label: string; fidic: string }[] = [
  { value: 'rfi', label: 'Request for Information (RFI)', fidic: '1.9' },
  { value: 'engineers_instruction', label: "Engineer's Instruction (EI)", fidic: '3.5' },
  { value: 'material_submittal', label: 'Material Submittal', fidic: '7.2' },
  { value: 'local_purchase_order', label: 'Local Purchase Order (LPO)', fidic: '—' },
  {
    value: 'interim_payment_application',
    label: 'Interim Payment Application (IPA)',
    fidic: '14.3',
  },
  { value: 'variation_order_request', label: 'Variation Order Request (VOR)', fidic: '13.3' },
];

const labelCls = 'font-mono text-[10px] uppercase tracking-widest text-steel-500';
const inputCls = 'border border-steel-200 bg-white px-3 py-2 font-sans text-sm text-steel-900';

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export default function DocumentsClient({
  projects,
  initialDocs,
  tableReady,
}: {
  projects: ProjectOption[];
  initialDocs: GeneratedDocRow[];
  tableReady: boolean;
}) {
  const [projectId, setProjectId] = useState(projects[0]?.id ?? '');
  const [docType, setDocType] = useState<DocType>('rfi');
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [packageRef, setPackageRef] = useState('');
  const [drawingRef, setDrawingRef] = useState('');
  // per-type inputs
  const [f, setF] = useState<Record<string, string>>({});
  const set = (k: string, v: string) => setF((s) => ({ ...s, [k]: v }));

  const [docs, setDocs] = useState<GeneratedDocRow[]>(initialDocs);
  const [openId, setOpenId] = useState<string | null>(initialDocs[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!projectId) return setError('Select a project first.');
    setLoading(true);

    const inputs: Record<string, string> = {};
    if (drawingRef) inputs.drawingRef = drawingRef;
    // Only the fields relevant to the chosen type are forwarded.
    const fieldsByType: Record<DocType, string[]> = {
      rfi: ['question'],
      engineers_instruction: ['description'],
      material_submittal: ['materialRef'],
      local_purchase_order: ['supplierName', 'items', 'totalValue'],
      interim_payment_application: ['periodEnd', 'grossAmount', 'previousAmount'],
      variation_order_request: ['description', 'valuation', 'timeImpact'],
    };
    for (const key of fieldsByType[docType]) if (f[key]) inputs[key] = f[key];

    try {
      const res = await fetch('/api/documents/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          docType,
          language,
          packageRef: packageRef || undefined,
          inputs,
        }),
      });
      const json = await res.json();
      if (!res.ok) return setError(json.error ?? 'Generation failed.');
      const row: GeneratedDocRow = {
        id: json.documentId,
        doc_type: docType,
        reference_no: json.referenceNo,
        title: json.title,
        status: 'draft',
        source: json.source,
        language,
        fidic_clause: json.fidicClause,
        body: { sections: json.sections },
        created_at: new Date().toISOString(),
      };
      setDocs((d) => [row, ...d]);
      setOpenId(row.id);
      setF({});
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function finalise(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/documents/${id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'final' }),
      });
      if (res.ok) setDocs((d) => d.map((x) => (x.id === id ? { ...x, status: 'final' } : x)));
    } finally {
      setBusyId(null);
    }
  }

  const typeInputs = (
    <>
      {docType === 'rfi' && (
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className={labelCls}>Question raised on site</span>
          <textarea
            value={f.question ?? ''}
            onChange={(e) => set('question', e.target.value)}
            rows={3}
            placeholder="What needs clarification?"
            className={inputCls}
          />
        </label>
      )}
      {docType === 'engineers_instruction' && (
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className={labelCls}>Instruction subject</span>
          <textarea
            value={f.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            rows={3}
            placeholder="What is the Contractor instructed to do?"
            className={inputCls}
          />
        </label>
      )}
      {docType === 'material_submittal' && (
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className={labelCls}>Material / product</span>
          <input
            value={f.materialRef ?? ''}
            onChange={(e) => set('materialRef', e.target.value)}
            placeholder="e.g. HDPE pipe, 315mm PN16"
            className={inputCls}
          />
        </label>
      )}
      {docType === 'local_purchase_order' && (
        <>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Supplier name</span>
            <input
              value={f.supplierName ?? ''}
              onChange={(e) => set('supplierName', e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Total value (AED)</span>
            <input
              value={f.totalValue ?? ''}
              onChange={(e) => set('totalValue', e.target.value)}
              placeholder="e.g. 250,000"
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={labelCls}>Materials / equipment</span>
            <textarea
              value={f.items ?? ''}
              onChange={(e) => set('items', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </label>
        </>
      )}
      {docType === 'interim_payment_application' && (
        <>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Period ending</span>
            <input
              value={f.periodEnd ?? ''}
              onChange={(e) => set('periodEnd', e.target.value)}
              placeholder="e.g. 31 Jul 2026"
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Gross value (AED)</span>
            <input
              value={f.grossAmount ?? ''}
              onChange={(e) => set('grossAmount', e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Previously certified (AED)</span>
            <input
              value={f.previousAmount ?? ''}
              onChange={(e) => set('previousAmount', e.target.value)}
              className={inputCls}
            />
          </label>
        </>
      )}
      {docType === 'variation_order_request' && (
        <>
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={labelCls}>Variation description</span>
            <textarea
              value={f.description ?? ''}
              onChange={(e) => set('description', e.target.value)}
              rows={2}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Cost impact (AED)</span>
            <input
              value={f.valuation ?? ''}
              onChange={(e) => set('valuation', e.target.value)}
              className={inputCls}
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelCls}>Time impact (days)</span>
            <input
              value={f.timeImpact ?? ''}
              onChange={(e) => set('timeImpact', e.target.value)}
              className={inputCls}
            />
          </label>
        </>
      )}
    </>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-steel-900">
          <FileSignature size={22} className="text-bayty-500" /> AI Documents
        </h1>
        <p className="mt-1 text-sm text-steel-500">
          Draft FIDIC-standard documents from your project data. AI is the first drafter — every
          document is created as an editable draft, then finalised and exported to PDF.
        </p>
      </div>

      {!tableReady && (
        <div className="border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          The documents table isn’t provisioned yet. Apply migration{' '}
          <code>012_generated_documents.sql</code> to save, finalise, and export documents.
        </div>
      )}

      {/* Generator */}
      <form
        onSubmit={generate}
        className="grid grid-cols-1 gap-4 border border-steel-200 bg-steel-50 p-6 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 sm:col-span-2">
          <span className={labelCls}>Project</span>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className={inputCls}
          >
            {projects.length === 0 && <option value="">No projects — create one first</option>}
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelCls}>Document type</span>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value as DocType)}
            className={inputCls}
          >
            {DOC_TYPES.map((d) => (
              <option key={d.value} value={d.value}>
                {d.label}
                {d.fidic !== '—' ? ` · FIDIC ${d.fidic}` : ''}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelCls}>Language</span>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as 'en' | 'ar')}
            className={inputCls}
          >
            <option value="en">English</option>
            <option value="ar">العربية (Arabic)</option>
          </select>
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelCls}>Package / discipline</span>
          <input
            value={packageRef}
            onChange={(e) => setPackageRef(e.target.value)}
            placeholder="e.g. MEP, Facade"
            className={inputCls}
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className={labelCls}>Drawing / spec reference</span>
          <input
            value={drawingRef}
            onChange={(e) => setDrawingRef(e.target.value)}
            placeholder="e.g. Drawing A-201 Rev C"
            className={inputCls}
          />
        </label>

        {typeInputs}

        {error && (
          <p role="alert" className="text-sm text-alert-500 sm:col-span-2">
            {error}
          </p>
        )}

        <div className="sm:col-span-2">
          <button
            type="submit"
            disabled={loading || !projectId}
            className="inline-flex items-center gap-2 bg-bayty-500 px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-bayty-600 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
            {loading ? 'Drafting…' : 'Generate draft'}
          </button>
        </div>
      </form>

      {/* Drafts */}
      <div className="space-y-3">
        <h2 className="font-mono text-[11px] uppercase tracking-widest text-steel-500">
          Generated documents ({docs.length})
        </h2>
        {docs.length === 0 && (
          <div className="border border-dashed border-steel-200 bg-white py-14 text-center text-sm text-steel-500">
            No documents yet. Generate your first draft above.
          </div>
        )}
        {docs.map((d) => {
          const open = openId === d.id;
          return (
            <div key={d.id} className="border border-steel-200 bg-white">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : d.id)}
                aria-expanded={open}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="min-w-0">
                  <p className="truncate font-sans text-sm font-medium text-steel-900">{d.title}</p>
                  <p className="mt-0.5 font-mono text-[11px] text-steel-500">
                    {d.reference_no} ·{' '}
                    <span className={d.status === 'final' ? 'text-forest-600' : 'text-steel-500'}>
                      {d.status}
                    </span>{' '}
                    ·{' '}
                    <span className={d.source === 'ai' ? 'text-bayty-600' : 'text-steel-400'}>
                      {d.source === 'ai' ? 'AI draft' : 'template draft'}
                    </span>
                    {d.fidic_clause ? ` · FIDIC ${d.fidic_clause}` : ''} · {fmtDate(d.created_at)}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-steel-400 transition-transform ${open ? 'rotate-180' : ''}`}
                />
              </button>
              {open && d.body?.sections && (
                <div className="border-t border-steel-200">
                  <div className="space-y-4 p-5" dir={d.language === 'ar' ? 'rtl' : 'ltr'}>
                    {d.body.sections.map((s, i) => (
                      <div key={i}>
                        <p className="font-mono text-[10px] uppercase tracking-widest text-steel-400">
                          {s.heading}
                        </p>
                        <p className="mt-1 whitespace-pre-line font-sans text-sm leading-relaxed text-steel-700">
                          {s.body}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3 border-t border-steel-200 px-5 py-4">
                    <a
                      href={`/documents/${d.id}/print`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 border border-steel-300 px-4 py-2 font-sans text-sm text-steel-700 transition-colors hover:border-steel-400"
                    >
                      <Printer size={14} /> Export PDF
                    </a>
                    {d.status !== 'final' && (
                      <button
                        type="button"
                        onClick={() => finalise(d.id)}
                        disabled={busyId === d.id}
                        className="inline-flex items-center gap-2 bg-forest-600 px-4 py-2 font-sans text-sm font-medium text-white transition-colors hover:bg-forest-400 disabled:opacity-50"
                      >
                        {busyId === d.id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={14} />
                        )}
                        Finalise
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
