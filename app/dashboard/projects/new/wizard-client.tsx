'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

import { createDraft } from '@/app/actions/projects/create-draft';
import { getProject } from '@/app/actions/projects/get-project';
import Step1Form from '@/components/dashboard/steps/step-1-form';
import Step2Form from '@/components/dashboard/steps/step-2-form';
import Step3Form from '@/components/dashboard/steps/step-3-form';
import Step4Form from '@/components/dashboard/steps/step-4-form';
import Step5Form from '@/components/dashboard/steps/step-5-form';
import WizardProgress from '@/components/dashboard/wizard-progress';
import { Skeleton } from '@/components/ui/skeleton';

import type { ProjectDraftRow } from '@/lib/db/projects';

const AUTO_SAVE_MS = 30_000;

export default function WizardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [projectId, setProjectId] = useState<string | null>(searchParams.get('id'));
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<ProjectDraftRow | null>(null);
  const [loading, setLoading] = useState(true);

  // Persist projectId into URL without a full navigation
  const setProject = useCallback((id: string) => {
    setProjectId(id);
    const url = new URL(window.location.href);
    url.searchParams.set('id', id);
    window.history.replaceState({}, '', url.toString());
  }, []);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        if (projectId) {
          const res = await getProject(projectId);
          if (res.success) {
            setDraft(res.data);
            setStep(res.data.current_step ?? 1);
          } else {
            // stale id — create new
            const created = await createDraft();
            if (created.success) setProject(created.data.projectId);
          }
        } else {
          const created = await createDraft();
          if (created.success) setProject(created.data.projectId);
        }
      } finally {
        setLoading(false);
      }
    }
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save heartbeat — re-fetches draft so step components always get fresh data
  const autoSaveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (!projectId) return;
    autoSaveTimer.current = setInterval(async () => {
      const res = await getProject(projectId);
      if (res.success) setDraft(res.data);
    }, AUTO_SAVE_MS);
    return () => {
      if (autoSaveTimer.current) clearInterval(autoSaveTimer.current);
    };
  }, [projectId]);

  function handleStepSaved(nextStep: number) {
    setStep(nextStep);
    // Refresh draft data
    if (projectId) {
      getProject(projectId).then((res) => {
        if (res.success) setDraft(res.data);
      });
    }
  }

  function handleSubmitted(referenceNumber: string) {
    toast.success(`Submitted — Reference: ${referenceNumber}`);
    router.push('/dashboard');
  }

  if (loading || !projectId) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-sm" />
        <Skeleton className="h-80 w-full rounded-sm" />
      </div>
    );
  }

  return (
    <div>
      <WizardProgress current={step} />

      {step === 1 && (
        <Step1Form
          projectId={projectId}
          defaultValues={draft?.org_data ?? undefined}
          onSaved={() => handleStepSaved(2)}
        />
      )}
      {step === 2 && (
        <Step2Form
          projectId={projectId}
          defaultValues={draft?.project_data ?? undefined}
          onSaved={() => handleStepSaved(3)}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <Step3Form
          projectId={projectId}
          defaultValues={draft?.scope_data ?? undefined}
          onSaved={() => handleStepSaved(4)}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <Step4Form
          projectId={projectId}
          onSaved={() => handleStepSaved(5)}
          onBack={() => setStep(3)}
        />
      )}
      {step === 5 && (
        <Step5Form
          projectId={projectId}
          draft={draft}
          onSubmitted={handleSubmitted}
          onBack={() => setStep(4)}
        />
      )}
    </div>
  );
}
