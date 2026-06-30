import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';

import OnboardingClient from './onboarding-client';

export const metadata = {
  title: { absolute: 'Set up your organization — BaytyAI' },
  robots: { index: false, follow: false },
};

export default async function OnboardingPage() {
  const supabase = await createClient();
  if (!supabase) redirect('/login');

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/onboarding');

  // Already has an org → straight to the dashboard.
  const { data: membership } = await supabase
    .from('memberships')
    .select('organization_id')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .maybeSingle();
  if (membership) redirect('/dashboard');

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-6 py-24">
      <div className="w-full max-w-xl">
        <div className="mx-auto mb-8 h-px w-10 bg-signal-500" />
        <h1 className="mb-3 text-center font-sans text-3xl font-semibold text-ink-100">
          Set up your organization
        </h1>
        <p className="mb-12 text-center font-sans text-sm leading-relaxed text-ink-300">
          Tell us who you are on the platform. This sets your permissions and how you appear in the
          marketplace.
        </p>
        <OnboardingClient />
      </div>
    </div>
  );
}
