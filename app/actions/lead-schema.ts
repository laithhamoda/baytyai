import { z } from 'zod';

export const INQUIRY_TYPES = [
  'private_access',
  'platform_demo',
  'starter',
  'professional',
  'enterprise',
  'consultation',
  'verified_professional',
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number];

export const ROLES = [
  'Owner/Developer',
  'Government/Ministry',
  'PMC/Consultant',
  'Main Contractor',
  'Subcontractor',
  'FM Operator',
  'Investor',
  'Other',
] as const;

export const REGIONS = ['KSA', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Other'] as const;

export const INQUIRY_HEADINGS: Record<InquiryType, string> = {
  private_access: 'Request private access',
  platform_demo: 'See the platform',
  starter: 'Get started with Starter',
  professional: 'Get started with Professional',
  enterprise: 'Get started with Enterprise',
  consultation: 'Arrange a consultation',
  verified_professional: 'Join as a verified professional',
};

export const leadSchema = z.object({
  fullName: z.string().min(1, 'Full name is required.').max(120),
  workEmail: z.string().email('Enter a valid work email.').max(160),
  organization: z.string().min(1, 'Organization is required.').max(160),
  role: z.string().min(1, 'Select a role.'),
  region: z.string().min(1, 'Select a region.'),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().max(500).optional().default(''),
  website: z.string().optional().default(''), // honeypot
});

export type LeadInput = z.infer<typeof leadSchema>;
export type LeadResult = { ok: true } | { ok: false; error: string };
