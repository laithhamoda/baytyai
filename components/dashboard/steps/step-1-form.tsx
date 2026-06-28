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
import { step1Schema, ENTITY_TYPES } from '@/lib/validations/project/step-1-schema';

import type { Step1Values } from '@/lib/validations/project/step-1-schema';
import type { Resolver } from 'react-hook-form';

const ENTITY_LABELS: Record<string, string> = {
  government: 'Government',
  semi_government: 'Semi-Government',
  pif_portfolio: 'PIF Portfolio',
  private_sector: 'Private Sector',
  fm_operator: 'FM Operator',
  tier1_contractor: 'Tier 1 Contractor',
  tier2_contractor: 'Tier 2 Contractor',
  consultant: 'Consultant',
  other: 'Other',
};

interface Props {
  projectId: string;
  defaultValues?: Record<string, unknown> | null;
  onSaved: () => void;
}

export default function Step1Form({ projectId, defaultValues, onSaved }: Props) {
  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema) as Resolver<Step1Values>,
    defaultValues: (defaultValues as Partial<Step1Values>) ?? {
      name_en: '',
      name_ar: '',
      commercial_registration: '',
      vat_number: '',
      country: '',
      city: '',
      poc_name: '',
      poc_role: '',
      poc_email: '',
      poc_phone: '',
      signatory_name: '',
      signatory_role: '',
      signatory_email: '',
    },
  });

  async function onSubmit(values: Step1Values) {
    const result = await saveStep(projectId, 1, values);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    onSaved();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Legal identity */}
        <section>
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            Organization — Legal Identity
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Legal Name (English)</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Development Co." {...field} />
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
                  <FormLabel>Legal Name (Arabic)</FormLabel>
                  <FormControl>
                    <Input dir="rtl" placeholder="شركة أكمي للتطوير" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="commercial_registration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commercial Registration No.</FormLabel>
                  <FormControl>
                    <Input placeholder="CR-1234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vat_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    VAT / TRN Number <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="300XXXXXXXXX003" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="Saudi Arabia" {...field} />
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
              name="entity_type"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Entity Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select entity type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {ENTITY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {ENTITY_LABELS[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Point of contact */}
        <section>
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            Primary Point of Contact
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="poc_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poc_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Head of PMO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poc_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corporate Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="name@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="poc_phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone (with country code)</FormLabel>
                  <FormControl>
                    <Input placeholder="+966501234567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* Authorized signatory */}
        <section>
          <h2 className="text-muted-foreground mb-4 text-sm font-semibold uppercase tracking-wider">
            Authorized Signatory
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="signatory_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signatory_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role / Title</FormLabel>
                  <FormControl>
                    <Input placeholder="CEO" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="signatory_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Corporate Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ceo@company.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving…' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
