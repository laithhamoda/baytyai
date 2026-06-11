import { z } from 'zod';
import { step1Schema } from './step-1-schema';
import { step2Schema } from './step-2-schema';
import { step3Schema } from './step-3-schema';
import { step4Schema } from './step-4-schema';
import { step5Schema } from './step-5-schema';

export const masterProjectSchema = z.object({
  step1: step1Schema,
  step2: step2Schema,
  step3: step3Schema,
  step4: step4Schema,
  step5: step5Schema,
});

export type MasterProjectValues = z.infer<typeof masterProjectSchema>;
