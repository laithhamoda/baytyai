import { z } from 'zod';

export const DOCUMENT_TYPES = [
  'feasibility_study',
  'master_plan',
  'design_drawings',
  'project_brief',
  'authority_approval',
  'environmental_impact',
  'land_title',
  'existing_contracts',
  'financial_model',
  'other',
] as const;

export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const uploadedDocumentSchema = z.object({
  id: z.string().uuid(),
  document_type: z.enum(DOCUMENT_TYPES),
  file_name: z.string().min(1).max(255),
  storage_path: z.string().min(1),
  file_size_bytes: z.number().int().positive(),
  mime_type: z.string().min(1).max(100),
  uploaded_at: z.string().datetime(),
});

export type UploadedDocument = z.infer<typeof uploadedDocumentSchema>;

export const step4Schema = z.object({
  documents: z.array(uploadedDocumentSchema).optional().default([]),
  upload_notes: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(1000).optional(),
  ),
});

export type Step4Values = z.infer<typeof step4Schema>;
