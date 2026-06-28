import { z } from 'zod';

const PHONE_REGEX = /^\+[1-9]\d{6,14}$/;

export const kycSchema = z.object({
  full_name: z.string().min(2, 'Required').max(200),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(PHONE_REGEX, 'Include country code, e.g. +971501234567'),
  nationality: z.string().min(2, 'Required').max(100),
  // File storage paths — set after upload, validated as non-empty strings
  id_front_path: z.string().min(1, 'Emirates ID front photo is required'),
  id_back_path: z.string().min(1, 'Emirates ID back photo is required'),
  selfie_path: z.string().min(1, 'Selfie holding your ID is required'),
  // Consent
  consent_identity_verification: z.literal(true, {
    error: 'You must consent to identity verification',
  }),
});

export type KycValues = z.infer<typeof kycSchema>;
