'use client';

import { FileSignature, Loader2, Sparkles, ChevronDown } from 'lucide-react';
import { useState } from 'react';

export type ProjectOption = { id: string; label: string };

type DocType = 'rfi' | 'engineers_instruction' | 'material_submittal';

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
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [materialRef, setMaterialRef] = useState('');
  const [drawingRef, setDrawingRef] = useState('');

  const [docs, setDocs] = useState<GeneratedDocRow[]>(initialDocs);
  const [openId, setOpenId] = useState<string | null>(initialDocs[0]?.id ?? null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!projectId) return setError('Select a project first.');
    setLoading(true);

    const inputs: Record<string, string> = {};
    if (drawingRef) inputs.drawingRef = drawingRef;
    if (docType === 'rfi' && question) inputs.question = question;
    if (docType === 'engineers_instruction' && description) inputs.description = description;
    if (docType === 'material_submittal' && materialRef) inputs.materialRef = materialRef;

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
      if (!res.ok) {
        setError(json.error ?? 'Generation failed.');
        return;
      }
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
      setQuestion('');
      setDescription('');
      setMaterialRef('');
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="flex items-center gap-2 font-display text-2xl font-semibold text-steel-900">
          <FileSignature size={22} className="text-bayty-500" /> AI Documents
        </h1>
        <p className="mt-1 text-sm text-steel-500">
          Draft FIDIC-standard documents from your project data. AI is the first drafter — every
          document is created as an editable draft.
        </p>
      </div>

      {!tableReady && (
        <div className="border border-orange-300 bg-orange-50 px-4 py-3 text-sm text-orange-700">
          The documents table isn’t provisioned yet. Apply migration{' '}
          <code>012_generated_documents.sql</code> to the database to save and list generated
          documents.
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
                {d.label} · FIDIC {d.fidic}
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

        {docType === 'rfi' && (
          <label className="flex flex-col gap-1 sm:col-span-2">
            <span className={labelCls}>Question raised on site</span>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              value={materialRef}
              onChange={(e) => setMaterialRef(e.target.value)}
              placeholder="e.g. HDPE pipe, 315mm PN16"
              className={inputCls}
            />
          </label>
        )}

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
                    {d.reference_no} · {d.status} ·{' '}
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
                <div
                  className="space-y-4 border-t border-steel-200 p-5"
                  dir={d.language === 'ar' ? 'rtl' : 'ltr'}
                >
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
