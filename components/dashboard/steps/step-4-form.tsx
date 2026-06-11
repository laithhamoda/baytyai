'use client';

import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { uploadDocument } from '@/app/actions/projects/upload-document';
import { deleteDocument } from '@/app/actions/projects/delete-document';
import { DOCUMENT_TYPES } from '@/lib/validations/project/step-4-schema';
import type { UploadedDocument, DocumentType } from '@/lib/validations/project/step-4-schema';
import { saveStep } from '@/app/actions/projects/save-step';
import { Upload, FileText, Trash2, Loader2 } from 'lucide-react';

const DOC_TYPE_LABELS: Record<string, string> = {
  feasibility_study: 'Feasibility Study',
  master_plan: 'Master Plan',
  design_drawings: 'Design Drawings',
  project_brief: 'Project Brief',
  authority_approval: 'Authority Approval',
  environmental_impact: 'Environmental Impact Assessment',
  land_title: 'Land Title / Deed',
  existing_contracts: 'Existing Contracts',
  financial_model: 'Financial Model',
  other: 'Other',
};

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

interface Props {
  projectId: string;
  onSaved: () => void;
  onBack: () => void;
}

export default function Step4Form({ projectId, onSaved, onBack }: Props) {
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [selectedType, setSelectedType] = useState<DocumentType>('project_brief');
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const result = await uploadDocument(projectId, selectedType, fd);
    setUploading(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    setDocuments((prev) => [...prev, result.data]);
    toast.success(`${file.name} uploaded`);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectedType],
  );

  async function handleDelete(doc: UploadedDocument) {
    const result = await deleteDocument(doc.id, projectId);
    if (!result.success) { toast.error(result.error); return; }
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    toast.success('Document removed');
  }

  async function handleSave() {
    setSaving(true);
    const result = await saveStep(projectId, 4, { documents });
    setSaving(false);
    if (!result.success) { toast.error(result.error); return; }
    onSaved();
  }

  return (
    <div className="space-y-6">
      <section>
        <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Supporting Documents
        </h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Upload relevant project documents. PDF, JPG, PNG, WEBP — max 25 MB per file.
        </p>

        {/* Type selector + drop zone */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="doc-type-select" className="mb-1.5 block text-sm font-medium text-foreground">
              Document Type
            </label>
            <Select
              value={selectedType}
              onValueChange={(v) => setSelectedType(v as DocumentType)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {DOCUMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{DOC_TYPE_LABELS[t]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <><Loader2 size={14} className="me-2 animate-spin" />Uploading…</>
            ) : (
              <><Upload size={14} className="me-2" />Choose File</>
            )}
          </Button>
        </div>

        {/* Drag-and-drop zone */}
        <div
          role="button"
          tabIndex={0}
          aria-label="Upload document — drag and drop or click to browse"
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          className={cn(
            'mt-4 flex cursor-pointer flex-col items-center justify-center rounded-sm border-2 border-dashed py-10 text-center transition-colors',
            dragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-muted/10 hover:border-primary/50',
          )}
        >
          <Upload size={28} className="mb-2 text-muted-foreground/60" />
          <p className="text-sm text-muted-foreground">
            Drag & drop a file here, or <span className="text-primary">click to browse</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Will be uploaded as: <strong className="text-foreground">{DOC_TYPE_LABELS[selectedType]}</strong>
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={onFileChange}
        />
      </section>

      {/* Uploaded files list */}
      {documents.length > 0 && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Uploaded ({documents.length})
          </h3>
          <ul className="space-y-2">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3"
              >
                <FileText size={16} className="shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{doc.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {DOC_TYPE_LABELS[doc.document_type]} · {fmtSize(doc.file_size_bytes)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(doc)}
                  className="shrink-0 rounded p-1 text-muted-foreground hover:text-destructive"
                  aria-label="Delete document"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save & Continue'}
        </Button>
      </div>
    </div>
  );
}
