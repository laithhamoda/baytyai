import { z } from 'zod';

export const SERVICE_MODULES = [
  'project_management',
  'document_control',
  'cost_management',
  'schedule_management',
  'risk_management',
  'quality_management',
  'hse',
  'procurement',
  'contracts_management',
  'bim_coordination',
  'site_management',
  'fm_operations',
  'reporting_analytics',
] as const;

export const INTEGRATION_SYSTEMS = [
  'oracle_primavera',
  'ms_project',
  'procore',
  'aconex',
  'e_builder',
  'sap',
  'oracle_erp',
  'microsoft_365',
  'autodesk_construction_cloud',
  'bentley',
  'other',
  'none',
] as const;

export const DATA_RESIDENCY_OPTIONS = [
  'ksa_only',
  'uae_only',
  'gcc_region',
  'no_preference',
] as const;

export const LANGUAGE_SUPPORT_OPTIONS = [
  'arabic_only',
  'english_only',
  'bilingual',
] as const;

export type ServiceModule = (typeof SERVICE_MODULES)[number];
export type IntegrationSystem = (typeof INTEGRATION_SYSTEMS)[number];
export type DataResidency = (typeof DATA_RESIDENCY_OPTIONS)[number];
export type LanguageSupport = (typeof LANGUAGE_SUPPORT_OPTIONS)[number];

const optStr = (max = 500) =>
  z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(max).optional(),
  );

const optDateStr = z.preprocess(
  (v) => (v === '' || v === null ? undefined : v),
  z.string().date().optional(),
);

export const step3Schema = z.object({
  service_modules: z
    .array(z.enum(SERVICE_MODULES))
    .min(1, 'Select at least one service module'),

  expected_users: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive('Must be a positive integer').optional(),
  ),

  expected_doc_volume: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().nonnegative().optional(),
  ),

  integrations: z.array(z.enum(INTEGRATION_SYSTEMS)).optional().default([]),

  data_residency: z.enum(DATA_RESIDENCY_OPTIONS, {
    error: 'Select data residency preference',
  }),

  language_support: z.enum(LANGUAGE_SUPPORT_OPTIONS, {
    error: 'Select language support',
  }),

  target_go_live: optDateStr,

  special_requirements: optStr(1000),
});

export type Step3Values = z.infer<typeof step3Schema>;
