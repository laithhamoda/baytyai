'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { saveStep } from '@/app/actions/projects/save-step';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  step2Schema,
  PROJECT_TYPES,
  ASSET_CLASSES,
  PROJECT_PHASES,
  CAPEX_BANDS,
  FUNDING_SOURCES,
} from '@/lib/validations/project/step-2-schema';

import type { Step2Values } from '@/lib/validations/project/step-2-schema';
import type { Resolver } from 'react-hook-form';

const LABELS = {
  project_type: {
    mega_project: 'Mega Project',
    giga_development: 'Giga Development',
    smart_city: 'Smart City',
    mixed_use: 'Mixed Use',
    infrastructure: 'Infrastructure',
    transport: 'Transport',
    healthcare: 'Healthcare',
    education: 'Education',
    industrial: 'Industrial',
    residential: 'Residential',
    hospitality: 'Hospitality',
    cultural: 'Cultural',
    defense: 'Defense',
    fm_only: 'FM Only',
  },
  asset_class: {
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    linear_infrastructure: 'Linear Infrastructure',
    mixed: 'Mixed',
  },
  project_phase: {
    concept: 'Concept',
    feasibility: 'Feasibility',
    design: 'Design',
    tender: 'Tender',
    construction: 'Construction',
    handover: 'Handover',
    operations_fm: 'Operations / FM',
  },
  capex_band: {
    under_50m: 'Under SAR 50M',
    '50m_250m': 'SAR 50M – 250M',
    '250m_1b': 'SAR 250M – 1B',
    '1b_5b': 'SAR 1B – 5B',
    '5b_plus': 'SAR 5B+',
  },
  funding_source: {
    government_budget: 'Government Budget',
    sovereign_wealth_fund: 'Sovereign Wealth Fund',
    private_equity: 'Private Equity',
    bank_financing: 'Bank Financing',
    ppp: 'PPP',
    other: 'Other',
  },
} as const;

interface Props {
  projectId: string;
  defaultValues?: Record<string, unknown> | null;
  onSaved: () => void;
  onBack: () => void;
}

export default function Step2Form({ projectId, defaultValues, onSaved, onBack }: Props) {
  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema) as Resolver<Step2Values>,
    defaultValues: (defaultValues as Partial<Step2Values>) ?? {},
  });

  async function onSubmit(values: Step2Values) {
    const result = await saveStep(projectId, 2, values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    onSaved();
  }

  function selectField(
    name: keyof Pick<
      Step2Values,
      'project_type' | 'asset_class' | 'project_phase' | 'capex_band' | 'funding_source'
    >,
    label: string,
    options: readonly string[],
    optLabels: Record<string, string>,
  ) {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {options.map((v) => (
                  <SelectItem key={v} value={v}>
                    {optLabels[v] ?? v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Name */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Project Name
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="King Abdullah Financial District" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name_ar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input dir="rtl" placeholder="مشروع كيدي" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Classification */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Classification
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {selectField('project_type', 'Project Type', PROJECT_TYPES, LABELS.project_type)}
            {selectField('asset_class', 'Asset Class', ASSET_CLASSES, LABELS.asset_class)}
            {selectField('project_phase', 'Current Phase', PROJECT_PHASES, LABELS.project_phase)}
          </div>
        </section>

        {/* Location */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Location
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="Riyadh" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gps_coordinates"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    GPS Coordinates <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="24.7136° N, 46.6753° E" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="masterplan_zone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Masterplan Zone <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Zone A — Residential" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Size & scale */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Size & Scale
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <FormField
              control={form.control}
              name="gfa_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    GFA (m²) <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="250000"
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
              name="site_area_sqm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Site Area (m²) <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      placeholder="500000"
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
              name="num_buildings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    No. of Buildings <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      step="1"
                      placeholder="12"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectField('capex_band', 'CAPEX Band', CAPEX_BANDS, LABELS.capex_band)}
          </div>
        </section>

        {/* Timeline & Funding */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Timeline & Funding
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="estimated_start"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Est. Start Date <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimated_completion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Est. Completion Date <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {selectField(
              'funding_source',
              'Funding Source',
              FUNDING_SOURCES,
              LABELS.funding_source,
            )}
            <FormField
              control={form.control}
              name="primary_regulator"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>
                    Primary Regulator <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="RCRC, MOMRA, RDA…" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
