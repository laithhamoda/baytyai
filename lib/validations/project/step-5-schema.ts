import { z } from 'zod';

export const step5Schema = z.object({
  // Declaratory confirmations required before submission
  confirm_data_accuracy: z.literal(true, {
    error: 'You must confirm that all information is accurate',
  }),
  confirm_authority_to_submit: z.literal(true, {
    error: 'You must confirm you are authorized to submit this request',
  }),
  consent_data_processing: z.literal(true, {
    error: 'Consent to data processing is required',
  }),
  consent_pdpl: z.literal(true, {
    error: 'Acknowledgement of applicable data protection obligations is required',
  }),

  // Optional message to the Bayty team
  submission_notes: z.preprocess(
    (v) => (v === '' || v === null ? undefined : v),
    z.string().max(2000).optional(),
  ),
});

export type Step5Values = z.infer<typeof step5Schema>;
