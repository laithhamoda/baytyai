import { z } from 'zod';

const optStr = (max = 500) =>
  z.preprocess((v) => (v === '' || v === null ? undefined : v), z.string().max(max).optional());

const optPositiveNumber = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().positive().optional(),
);

const optPositiveInt = z.preprocess(
  (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
  z.number().int().positive().optional(),
);

const optDateStr = z.preprocess(
  (v) => (v === '' || v === null ? undefined : v),
  z.string().date().optional(),
);

export const PROJECT_TYPES = [
  'mega_project',
  'giga_development',
  'smart_city',
  'mixed_use',
  'infrastructure',
  'transport',
  'healthcare',
  'education',
  'industrial',
  'residential',
  'hospitality',
  'cultural',
  'defense',
  'fm_only',
] as const;

export const ASSET_CLASSES = ['vertical', 'horizontal', 'linear_infrastructure', 'mixed'] as const;

export const PROJECT_PHASES = [
  'concept',
  'feasibility',
  'design',
  'tender',
  'construction',
  'handover',
  'operations_fm',
] as const;

export const CAPEX_BANDS = ['under_50m', '50m_250m', '250m_1b', '1b_5b', '5b_plus'] as const;

export const FUNDING_SOURCES = [
  'government_budget',
  'sovereign_wealth_fund',
  'private_equity',
  'bank_financing',
  'ppp',
  'other',
] as const;

export type ProjectType = (typeof PROJECT_TYPES)[number];
export type AssetClass = (typeof ASSET_CLASSES)[number];
export type ProjectPhase = (typeof PROJECT_PHASES)[number];
export type CapexBand = (typeof CAPEX_BANDS)[number];
export type FundingSource = (typeof FUNDING_SOURCES)[number];

export const step2Schema = z
  .object({
    // Bilingual project name
    name_en: z.string().min(2, 'Required').max(300),
    name_ar: z.string().min(2, 'Required').max(300),

    // Classification
    project_type: z.enum(PROJECT_TYPES, { error: 'Select project type' }),
    asset_class: z.enum(ASSET_CLASSES, { error: 'Select asset class' }),
    project_phase: z.enum(PROJECT_PHASES, { error: 'Select project phase' }),

    // Location
    country: z.string().min(2, 'Required').max(100),
    city: z.string().min(2, 'Required').max(100),
    gps_coordinates: optStr(100),
    masterplan_zone: optStr(200),

    // Size & scale
    gfa_sqm: optPositiveNumber,
    site_area_sqm: optPositiveNumber,
    num_buildings: optPositiveInt,
    capex_band: z.enum(CAPEX_BANDS, { error: 'Select CAPEX band' }),

    // Timeline
    estimated_start: optDateStr,
    estimated_completion: optDateStr,

    // Funding & governance
    funding_source: z.enum(FUNDING_SOURCES, { error: 'Select funding source' }),
    primary_regulator: optStr(300),
  })
  .refine(
    (data) => {
      if (data.estimated_start && data.estimated_completion) {
        return new Date(data.estimated_completion) > new Date(data.estimated_start);
      }
      return true;
    },
    {
      message: 'Completion date must be after start date',
      path: ['estimated_completion'],
    },
  );

export type Step2Values = z.infer<typeof step2Schema>;
