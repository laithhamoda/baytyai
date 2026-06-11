import { z } from 'zod';
import {
  createOrganization,
  createMembership,
  createInvitation,
  getMembers,
} from '@/lib/repositories/organizations';
import { writeAuditLog } from '@/lib/db/audit';
import type { OrgRole, Organization } from '@/lib/types/tenancy';

const createOrgSchema = z.object({
  name: z.string().min(2).max(80),
  slug: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, and hyphens only'),
});

export async function createOrgWithOwner(
  input: { name: string; slug: string },
  userId: string,
): Promise<Organization> {
  const parsed = createOrgSchema.safeParse(input);
  if (!parsed.success) throw new Error(parsed.error.issues[0].message);

  const org = await createOrganization(parsed.data.name, parsed.data.slug, userId);
  await createMembership(org.id, userId, 'owner');
  await writeAuditLog({
    userId,
    action: 'org.created',
    entityType: 'organization',
    entityId: org.id,
    metadata: { name: org.name, slug: org.slug },
  });
  return org;
}

export async function inviteMember(
  orgId: string,
  email: string,
  role: OrgRole,
  invitedBy: string,
) {
  const inv = await createInvitation(orgId, email, role, invitedBy);
  await writeAuditLog({
    userId: invitedBy,
    action: 'member.invited',
    entityType: 'invitation',
    entityId: inv.id,
    metadata: { email, role, orgId },
  });
  return inv;
}

export { getMembers };
