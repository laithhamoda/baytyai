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
        { name: "Unlimited Projects", body: "Create and manage unlimited projects with a 9-stage lifecycle tracker." },
        { name: "Verified Team Assembly", body: "Assemble your verified team — invite, check credentials, assign roles in one step." },
        { name: "Decisions From Anywhere", body: "Approve, reject, and escalate decisions from any device with a full audit trail." },
        { name: "Portfolio Analytics", body: "Track progress, spend, and bottlenecks across all active projects in real time." },
        { name: "Document Oversight", body: "Maintain a single source of truth for drawings, contracts, and site records." },
        { name: "Marketplace Access", body: "Source verified professionals and properties within the same authorised workspace." },
      ]}
    />
  );
}
