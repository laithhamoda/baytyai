'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Upload, CheckCircle2, Clock, XCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { uploadKycDocument, submitKyc } from '@/app/actions/kyc/submit-kyc';
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
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { kycSchema } from '@/lib/validations/kyc/kyc-schema';

import type { KycValues } from '@/lib/validations/kyc/kyc-schema';
import type { Resolver } from 'react-hook-form';

type UploadField = 'id_front' | 'id_back' | 'selfie';

const UPLOAD_FIELDS: {
  key: UploadField;
  label: string;
  hint: string;
  formField: keyof KycValues;
}[] = [
  {
    key: 'id_front',
    label: 'Emirates ID — Front',
    hint: 'Clear photo of the front of your Emirates ID',
    formField: 'id_front_path',
  },
  {
    key: 'id_back',
    label: 'Emirates ID — Back',
    hint: 'Clear photo of the back of your Emirates ID',
    formField: 'id_back_path',
  },
  {
    key: 'selfie',
    label: 'Selfie Holding ID',
    hint: 'A clear photo of your face while holding your Emirates ID',
    formField: 'selfie_path',
  },
];

function StatusBanner({ status }: { status: string }) {
  const config = {
    pending_review: {
      icon: <Clock size={18} className="shrink-0 text-yellow-400" />,
      text: 'Your documents are under review. We will notify you once the verification is complete.',
      cls: 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300',
    },
    approved: {
      icon: <CheckCircle2 size={18} className="shrink-0 text-primary" />,
      text: 'Your identity has been verified. You have full access to the dashboard.',
      cls: 'border-primary/30 bg-primary/10 text-primary',
    },
    rejected: {
      icon: <XCircle size={18} className="shrink-0 text-destructive" />,
      text: 'Your verification was not approved. Please re-submit with clear, valid documents.',
      cls: 'border-destructive/30 bg-destructive/10 text-destructive',
    },
    resubmit_requested: {
      icon: <XCircle size={18} className="shrink-0 text-orange-400" />,
      text: 'Additional information is required. Please re-submit your documents.',
      cls: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
    },
  }[status];

  if (!config) return null;

  return (
    <div
      className={cn('mb-6 flex items-start gap-3 rounded-sm border px-4 py-3 text-sm', config.cls)}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

interface Props {
  existingStatus: string | null;
}

export default function KycClient({ existingStatus }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/dashboard';

  const [uploadedPaths, setUploadedPaths] = useState<Partial<Record<UploadField, string>>>({});
  const [uploading, setUploading] = useState<Partial<Record<UploadField, boolean>>>({});

  const form = useForm<KycValues>({
    resolver: zodResolver(kycSchema) as Resolver<KycValues>,
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      nationality: '',
      id_front_path: '',
      id_back_path: '',
      selfie_path: '',
      consent_identity_verification: undefined,
    },
  });

  async function handleFileUpload(field: UploadField, file: File) {
    setUploading((prev) => ({ ...prev, [field]: true }));
    const fd = new FormData();
    fd.append('file', file);
    const result = await uploadKycDocument(field, fd);
    setUploading((prev) => ({ ...prev, [field]: false }));

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    const path = result.data.storagePath;
    setUploadedPaths((prev) => ({ ...prev, [field]: path }));

    const formFieldMap: Record<UploadField, keyof KycValues> = {
      id_front: 'id_front_path',
      id_back: 'id_back_path',
      selfie: 'selfie_path',
    };
    form.setValue(formFieldMap[field], path, { shouldValidate: true });
    toast.success(`${file.name} uploaded`);
  }

  async function onSubmit(values: KycValues) {
    const result = await submitKyc({
      fullName: values.full_name,
      email: values.email,
      phone: values.phone,
      nationality: values.nationality,
      idFrontPath: values.id_front_path,
      idBackPath: values.id_back_path,
      selfiePath: values.selfie_path,
    });

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Verification submitted — we will review your documents shortly.');
    router.push(nextPath);
  }

  // Don't show the form if already pending or approved
  const locked = existingStatus === 'pending_review' || existingStatus === 'approved';

  return (
    <div>
      {existingStatus && <StatusBanner status={existingStatus} />}

      {!locked && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal info */}
            <section>
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Personal Information
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Legal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="As shown on your Emirates ID" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nationality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nationality</FormLabel>
                      <FormControl>
                        <Input placeholder="United Arab Emirates" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (with country code)</FormLabel>
                      <FormControl>
                        <Input placeholder="+971501234567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </section>

            {/* Document uploads */}
            <section>
              <h2 className="mb-1 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Identity Documents
              </h2>
              <p className="mb-4 text-xs text-muted-foreground">
                Upload clear photos. JPG, PNG, WEBP, or HEIC — max 10 MB each.
              </p>
              <div className="grid gap-4 sm:grid-cols-3">
                {UPLOAD_FIELDS.map(({ key, label, hint, formField }) => {
                  const uploaded = !!uploadedPaths[key];
                  const isUploading = uploading[key];
                  const error = form.formState.errors[formField];

                  return (
                    <FormField
                      key={key}
                      control={form.control}
                      name={formField}
                      render={() => (
                        <FormItem>
                          <FormLabel>{label}</FormLabel>
                          <label
                            className={cn(
                              'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed px-4 py-6 text-center transition-colors',
                              uploaded
                                ? 'border-primary/50 bg-primary/5'
                                : error
                                  ? 'border-destructive/50 bg-destructive/5'
                                  : 'border-border hover:border-primary/40',
                            )}
                          >
                            {isUploading ? (
                              <Loader2 size={22} className="animate-spin text-muted-foreground" />
                            ) : uploaded ? (
                              <CheckCircle2 size={22} className="text-primary" />
                            ) : (
                              <Camera size={22} className="text-muted-foreground/60" />
                            )}
                            <span className="text-xs text-muted-foreground">{hint}</span>
                            {uploaded && (
                              <span className="text-[10px] font-medium text-primary">Uploaded</span>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              disabled={isUploading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(key, file);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  );
                })}
              </div>
            </section>

            {/* Consent */}
            <section>
              <div className="rounded-sm border border-border bg-card p-4">
                <FormField
                  control={form.control}
                  name="consent_identity_verification"
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
                          I consent to Bayty Technologies collecting and processing the above
                          personal data and identity documents for the purpose of identity
                          verification, in accordance with applicable data protection laws.
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </section>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="min-w-[160px]"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 size={14} className="me-2 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  <>
                    <Upload size={14} className="me-2" />
                    Submit for Verification
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      )}

      {locked && existingStatus === 'approved' && (
        <div className="mt-4 flex justify-end">
          <Button onClick={() => router.push(nextPath)}>Continue to Dashboard</Button>
        </div>
      )}
    </div>
  );
}
