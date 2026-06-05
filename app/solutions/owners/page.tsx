import type { Metadata } from "next";
import RoleDetail from "@/components/sections/role-detail";

export const metadata: Metadata = {
  title: "For Owners & Developers — Bayty",
  description:
    "Bayty gives project owners and developers full control over project creation, team assembly, approvals, and portfolio analytics.",
};

export default function OwnersPage() {
  return (
    <RoleDetail
      overline="For Owners & Developers"
      title="Complete authority over every development"
      intro="From a single dashboard, project owners and general managers create projects, assemble verified teams, hold final approval authority, and monitor performance across an entire portfolio."
      capabilities={[
        { name: "Project Creation", body: "Launch new developments with structured stages, scopes, and assigned stakeholders from day one." },
        { name: "Team Assembly", body: "Invite and verify engineers, consultants, and contractors before they gain project access." },
        { name: "Approval Authority", body: "Hold final sign-off on every revision, contract, and milestone with a complete audit trail." },
        { name: "Portfolio Analytics", body: "Track progress, spend, and bottlenecks across all active projects in real time." },
        { name: "Document Oversight", body: "Maintain a single source of truth for drawings, contracts, and site records." },
        { name: "Marketplace Access", body: "Source verified professionals and properties within the same authorised workspace." },
      ]}
    />
  );
}
