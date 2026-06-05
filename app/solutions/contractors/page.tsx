import type { Metadata } from "next";
import RoleDetail from "@/components/sections/role-detail";

export const metadata: Metadata = {
  title: "For Contractors & Subcontractors — Bayty",
  description:
    "Bayty gives contractors and subcontractors structured installation briefs, supply management, and verified access to project documents.",
};

export default function ContractorsPage() {
  return (
    <RoleDetail
      overline="For Contractors"
      title="Structured scope, on a verified platform"
      intro="Contractors and subcontractors receive clear installation briefs, manage supply and editing, and access exactly the project documents their scope requires — nothing more."
      capabilities={[
        { name: "Installation Briefs", body: "Receive precise, structured scope documents for every assignment you take on." },
        { name: "Supply Management", body: "Edit and submit supply lists with version control and approval tracking." },
        { name: "Document Access", body: "Access the drawings, specifications, and contracts relevant to your scope." },
        { name: "Verified Profile", body: "Build a verified credential profile that owners and consultants can trust." },
        { name: "Approval Tracking", body: "See the real-time status of every sign-off your work depends on." },
        { name: "Direct Communication", body: "Keep every project conversation on record, in one authorised place." },
      ]}
    />
  );
}
