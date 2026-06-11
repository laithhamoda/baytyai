'use client';
import { useState } from 'react';
import { toast } from 'sonner';

import { sendInvitation } from '@/app/actions/tenancy/invite-member';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

import type { Membership, OrgRole } from '@/lib/types/tenancy';

interface Props {
  members: (Membership & { profile: { full_name: string; avatar_url: string | null } })[];
  activeRole: OrgRole | null;
}

const ROLE_LABELS: Record<OrgRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  manager: 'Manager',
  member: 'Member',
  viewer: 'Viewer',
};

const canInvite = (role: OrgRole | null) => role === 'owner' || role === 'admin';

export default function MembersClient({ members, activeRole }: Props) {
  const [busy, setBusy] = useState(false);
  const [role, setRole] = useState<OrgRole>('member');

  async function onInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set('role', role);
    const result = await sendInvitation(fd);
    setBusy(false);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    toast.success('Invitation sent');
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* Members list */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Team members ({members.length})
        </h2>
        <ul className="space-y-2">
          {members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 rounded-sm border border-border bg-card px-4 py-3"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {m.profile.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {m.profile.full_name || 'Unknown'}
                </p>
              </div>
              <span className="text-xs text-muted-foreground">{ROLE_LABELS[m.role]}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Invite form — visible to admin/owner only */}
      {canInvite(activeRole) && (
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Invite a team member
          </h2>
          <form onSubmit={onInvite} className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label
                htmlFor="invite-email"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Email
              </label>
              <Input
                id="invite-email"
                name="email"
                type="email"
                required
                placeholder="colleague@company.ae"
              />
            </div>
            <div className="w-36">
              <p className="mb-1.5 text-sm font-medium text-foreground">Role</p>
              <Select value={role} onValueChange={(v) => setRole(v as OrgRole)}>
                <SelectTrigger aria-label="Select member role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(['admin', 'manager', 'member', 'viewer'] as OrgRole[]).map((r) => (
                    <SelectItem key={r} value={r}>
                      {ROLE_LABELS[r]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={busy}>
              {busy ? 'Sending…' : 'Send invite'}
            </Button>
          </form>
        </section>
      )}
    </div>
  );
}
