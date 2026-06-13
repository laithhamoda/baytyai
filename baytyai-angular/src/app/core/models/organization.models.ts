export interface CreateOrganizationRequest {
  name: string;
}

export interface OrganizationDto {
  id: string;
  name: string;
  slug: string;
  plan: string;
  createdAt: string;
}

export interface InviteMemberRequest {
  email: string;
  role: MemberRole;
}

export interface MemberDto {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: MemberRole;
  joinedAt: string;
}

export enum MemberRole {
  Owner = 1,
  Admin = 2,
  Member = 3
}
