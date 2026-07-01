'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { saveStep } from '@/app/actions/projects/save-step';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  step3Schema,
  SERVICE_MODULES,
  INTEGRATION_SYSTEMS,
  DATA_RESIDENCY_OPTIONS,
  LANGUAGE_SUPPORT_OPTIONS,
} from '@/lib/validations/project/step-3-schema';

import type { Step3Values } from '@/lib/validations/project/step-3-schema';
import type { Resolver } from 'react-hook-form';

const MODULE_LABELS: Record<string, string> = {
  project_management: 'Project Management',
  document_control: 'Document Control',
  cost_management: 'Cost Management',
  schedule_management: 'Schedule Management',
  risk_management: 'Risk Management',
  quality_management: 'Quality Management',
  hse: 'HSE',
  procurement: 'Procurement',
  contracts_management: 'Contracts Management',
  bim_coordination: 'BIM Coordination',
  site_management: 'Site Management',
  fm_operations: 'FM Operations',
  reporting_analytics: 'Reporting & Analytics',
};

const INTEGRATION_LABELS: Record<string, string> = {
  oracle_primavera: 'Oracle Primavera P6',
  ms_project: 'MS Project',
  procore: 'Procore',
  aconex: 'Aconex',
  e_builder: 'e-Builder',
  sap: 'SAP',
  oracle_erp: 'Oracle ERP',
  microsoft_365: 'Microsoft 365',
  autodesk_construction_cloud: 'Autodesk Construction Cloud',
  bentley: 'Bentley',
  other: 'Other',
  none: 'None / Not applicable',
};

const DATA_RESIDENCY_LABELS: Record<string, string> = {
  ksa_only: 'KSA only (in-country)',
  uae_only: 'Single country only',
  gcc_region: 'Regional / multi-country',
  no_preference: 'No preference',
};

const LANGUAGE_LABELS: Record<string, string> = {
  arabic_only: 'Arabic only',
  english_only: 'English only',
  bilingual: 'Bilingual (Arabic + English)',
};

interface Props {
  projectId: string;
  defaultValues?: Record<string, unknown> | null;
  onSaved: () => void;
  onBack: () => void;
}

export default function Step3Form({ projectId, defaultValues, onSaved, onBack }: Props) {
  const form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema) as Resolver<Step3Values>,
    defaultValues: (defaultValues as Partial<Step3Values>) ?? {
      service_modules: [],
      integrations: [],
    },
  });

  async function onSubmit(values: Step3Values) {
    const result = await saveStep(projectId, 3, values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    onSaved();
  }

  const watchedModules = form.watch('service_modules') ?? [];
  const watchedIntegrations = form.watch('integrations') ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Service modules */}
        <section>
          <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Service Modules Required
          </h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Select all modules your project needs.
          </p>
          <FormField
            control={form.control}
            name="service_modules"
            render={() => (
              <FormItem>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {SERVICE_MODULES.map((mod) => (
                    <FormField
                      key={mod}
                      control={form.control}
                      name="service_modules"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={watchedModules.includes(mod)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked ? [...current, mod] : current.filter((v) => v !== mod),
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            {MODULE_LABELS[mod]}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Users & volumes */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Scale & Volumes
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="expected_users"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expected Platform Users{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      placeholder="50"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expected_doc_volume"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expected Monthly Documents{' '}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="500"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormDescription className="text-xs">
                    Estimate for document control sizing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Integrations */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Existing Systems / Integrations
          </h2>
          <FormField
            control={form.control}
            name="integrations"
            render={() => (
              <FormItem>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {INTEGRATION_SYSTEMS.map((sys) => (
                    <FormField
                      key={sys}
                      control={form.control}
                      name="integrations"
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={(watchedIntegrations ?? []).includes(sys)}
                              onCheckedChange={(checked) => {
                                const current = field.value ?? [];
                                field.onChange(
                                  checked ? [...current, sys] : current.filter((v) => v !== sys),
                                );
                              }}
                            />
                          </FormControl>
                          <FormLabel className="cursor-pointer font-normal">
                            {INTEGRATION_LABELS[sys]}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        {/* Preferences */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Platform Preferences
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="data_residency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data Residency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preference" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {DATA_RESIDENCY_OPTIONS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {DATA_RESIDENCY_LABELS[v]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="language_support"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Support</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LANGUAGE_SUPPORT_OPTIONS.map((v) => (
                        <SelectItem key={v} value={v}>
                          {LANGUAGE_LABELS[v]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="target_go_live"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Target Go-Live Date <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Special requirements */}
        <section>
          <FormField
            control={form.control}
            name="special_requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Special Requirements <span className="text-muted-foreground">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any unique technical, compliance, or operational requirements…"
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving…' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
