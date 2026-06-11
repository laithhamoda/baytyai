export type OrgRole = 'owner' | 'admin' | 'manager' | 'member' | 'viewer';
export type OrgTier = 'free' | 'pro' | 'business' | 'enterprise';
export type MembershipStatus = 'active' | 'suspended';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  tier: OrgTier;
  stripe_customer_id: string | null;
  logo_url: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Membership {
  id: string;
  organization_id: string;
  user_id: string;
  role: OrgRole;
  status: MembershipStatus;
  invited_by: string | null;
  created_at: string;
}

export interface Invitation {
  id: string;
  organization_id: string;
  email: string;
  role: OrgRole;
  token: string;
  invited_by: string;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  locale: 'en' | 'ar';
  role: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface ActiveOrg {
  userId: string;
  orgId: string | null;
  orgRole: OrgRole | null;
  isAdmin: boolean;
}
