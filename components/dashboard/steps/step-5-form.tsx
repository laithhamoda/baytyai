'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { submitProject } from '@/app/actions/projects/submit-project';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { step5Schema } from '@/lib/validations/project/step-5-schema';

import type { ProjectDraftRow } from '@/lib/db/projects';
import type { Step5Values } from '@/lib/validations/project/step-5-schema';
import type { Resolver } from 'react-hook-form';

const STATUS_LABEL: Record<string, string> = {
  project_type: 'Project Type',
  asset_class: 'Asset Class',
  project_phase: 'Phase',
  capex_band: 'CAPEX Band',
  funding_source: 'Funding Source',
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border flex justify-between border-b py-2 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground font-medium">{value}</span>
    </div>
  );
}

interface Props {
  projectId: string;
  draft: ProjectDraftRow | null;
  onSubmitted: (referenceNumber: string) => void;
  onBack: () => void;
}

export default function Step5Form({ projectId, draft, onSubmitted, onBack }: Props) {
  const form = useForm<Step5Values>({
    resolver: zodResolver(step5Schema) as Resolver<Step5Values>,
    defaultValues: {
      confirm_data_accuracy: undefined,
      confirm_authority_to_submit: undefined,
      consent_data_processing: undefined,
      consent_pdpl: undefined,
      submission_notes: '',
    },
  });

  async function onSubmit(values: Step5Values) {
    void values; // step5 fields are confirmed in submitProject server action
    const result = await submitProject(projectId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    onSubmitted(result.data.referenceNumber);
  }

  // Build readiness check
  const hasOrg = Boolean(draft?.org_data);
  const hasProject = Boolean(draft?.project_data);
  const hasScope = Boolean(draft?.scope_data);

  const readiness = [
    { label: 'Organization & Contracting Entity', ok: hasOrg },
    { label: 'Project Profile', ok: hasProject },
    { label: 'Engagement Scope', ok: hasScope },
    { label: 'Documents (optional)', ok: true },
  ];

  const allReady = hasOrg && hasProject && hasScope;

  const p2 = draft?.project_data as Record<string, string> | null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Readiness checklist */}
        <section>
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            Submission Readiness
          </h2>
          <ul className="space-y-2">
            {readiness.map((item) => (
              <li key={item.label} className="flex items-center gap-3 text-sm">
                {item.ok ? (
                  <CheckCircle2 size={16} className="text-primary shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-destructive shrink-0" />
                )}
                <span className={item.ok ? 'text-foreground' : 'text-destructive'}>
                  {item.label}
                </span>
                {!item.ok && (
                  <span className="text-destructive ms-auto text-xs">Incomplete — go back</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        {/* Summary */}
        {p2 && (
          <section>
            <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
              Project Summary
            </h2>
            <div className="border-border bg-card rounded-sm border px-4">
              {p2.name_en && <SummaryRow label="Project Name" value={p2.name_en} />}
              {p2.country && (
                <SummaryRow label="Location" value={`${p2.city ?? ''}, ${p2.country}`} />
              )}
              {p2.project_type && (
                <SummaryRow label="Type" value={p2.project_type.replace(/_/g, ' ')} />
              )}
              {p2.project_phase && (
                <SummaryRow label="Phase" value={p2.project_phase.replace(/_/g, ' ')} />
              )}
              {p2.capex_band && (
                <SummaryRow label="CAPEX Band" value={p2.capex_band.replace(/_/g, ' ')} />
              )}
              {p2.funding_source && (
                <SummaryRow label="Funding" value={p2.funding_source.replace(/_/g, ' ')} />
              )}
            </div>
          </section>
        )}

        {/* Submission notes */}
        <section>
          <FormField
            control={form.control}
            name="submission_notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Message to Bayty Team <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional context or special instructions for the Bayty team…"
                    rows={3}
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Declarations */}
        <section>
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            Declarations & Consent
          </h2>
          <div className="border-border bg-card space-y-4 rounded-sm border p-4">
            <FormField
              control={form.control}
              name="confirm_data_accuracy"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true ? true : undefined)}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-normal leading-snug">
                      I confirm that all information provided in this submission is accurate and
                      complete to the best of my knowledge.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm_authority_to_submit"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true ? true : undefined)}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-normal leading-snug">
                      I am authorized by my organization to submit this project intake request on
                      their behalf.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent_data_processing"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true ? true : undefined)}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-normal leading-snug">
                      I consent to Bayty Technologies processing the submitted data for the purpose
                      of evaluating and delivering the requested services.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="consent_pdpl"
              render={({ field }) => (
                <FormItem className="flex items-start gap-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value === true}
                      onCheckedChange={(v) => field.onChange(v === true ? true : undefined)}
                    />
                  </FormControl>
                  <div>
                    <FormLabel className="text-sm font-normal leading-snug">
                      I acknowledge that this submission is subject to the{' '}
                      <span className="text-primary">
                        Saudi Personal Data Protection Law (PDPL)
                      </span>{' '}
                      and{' '}
                      <span className="text-primary">UAE Federal Decree-Law No. 45 of 2021</span>,
                      and that my organization accepts the applicable data protection obligations.
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </section>

        {!allReady && (
          <div className="border-destructive/40 bg-destructive/10 text-destructive flex items-center gap-2 rounded-sm border px-4 py-3 text-sm">
            <AlertCircle size={15} className="shrink-0" />
            Please complete all required steps before submitting.
          </div>
        )}

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting || !allReady}
            className="min-w-[140px]"
          >
            {form.formState.isSubmitting ? 'Submitting…' : 'Submit Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
