import { z } from 'zod';

// Free consumer email domains — corporate email required for dashboard access.
const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com',
  'icloud.com', 'aol.com', 'protonmail.com', 'proton.me', 'yandex.com',
  'mail.com', 'zoho.com', 'inbox.com', 'ymail.com', 'me.com',
  'mac.com', 'googlemail.com', 'msn.com',
]);

function isCorporateEmail(email: string): boolean {
  const parts = email.toLowerCase().split('@');
  if (parts.length !== 2 || !parts[1]) return false;
  return !FREE_EMAIL_DOMAINS.has(parts[1]);
}

// E.164-compatible phone: +{country_code}{number}, 7-15 digits total after +
const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

const optStr = (max = 500) =>
  z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(max).optional(),
  );

export const ENTITY_TYPES = [
  'government',
  'semi_government',
  'pif_portfolio',
  'private_sector',
  'fm_operator',
  'tier1_contractor',
  'tier2_contractor',
  'consultant',
  'other',
] as const;

export type EntityType = (typeof ENTITY_TYPES)[number];

export const step1Schema = z.object({
  // Legal identity
  name_en: z.string().min(2, 'Required').max(200),
  name_ar: z.string().min(2, 'Required').max(200),
  commercial_registration: z.string().min(3, 'Required').max(50),
  vat_number: optStr(50),
  country: z.string().min(2, 'Required').max(100),
  city: z.string().min(2, 'Required').max(100),
  entity_type: z.enum(ENTITY_TYPES, { error: 'Select entity type' }),

  // Primary point of contact
  poc_name: z.string().min(2, 'Required').max(200),
  poc_role: z.string().min(2, 'Required').max(200),
  poc_email: z
    .string()
    .email('Invalid email')
    .refine(isCorporateEmail, 'A corporate email address is required (not Gmail, Hotmail, etc.)'),
  poc_phone: z
    .string()
    .regex(PHONE_REGEX, 'Include country code, e.g. +971501234567'),

  // Authorized signatory
  signatory_name: z.string().min(2, 'Required').max(200),
  signatory_role: z.string().min(2, 'Required').max(200),
  signatory_email: z
    .string()
    .email('Invalid email')
    .refine(isCorporateEmail, 'A corporate email address is required'),
});

export type Step1Values = z.infer<typeof step1Schema>;
