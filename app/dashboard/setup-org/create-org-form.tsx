'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { createOrg } from '@/app/actions/tenancy/create-org';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function CreateOrgForm() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [slug, setSlug] = useState('');

  function deriveSlug(name: string) {
    setSlug(
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, ''),
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const result = await createOrg(new FormData(e.currentTarget));
    setBusy(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Organization created');
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label htmlFor="org-name" className="text-foreground mb-1.5 block text-sm font-medium">
          Organization name
        </label>
        <Input
          id="org-name"
          name="name"
          required
          minLength={2}
          maxLength={80}
          placeholder="Al Nakheel Development"
          onChange={(e) => deriveSlug(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="org-slug" className="text-foreground mb-1.5 block text-sm font-medium">
          URL slug
        </label>
        <Input
          id="org-slug"
          name="slug"
          required
          minLength={2}
          maxLength={40}
          pattern="[a-z0-9-]+"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="al-nakheel-development"
        />
        <p className="text-muted-foreground mt-1 text-xs">
          Lowercase letters, numbers, hyphens only.
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? 'Creating…' : 'Create organization'}
      </Button>
    </form>
  );
}
