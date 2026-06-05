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
        { name: "Verified Profile", body: "Build your verified professional profile — government-linked credential check in 24 hours." },
        { name: "Get Discovered", body: "Get discovered in every project search that matches your specialism and GCC location." },
        { name: "Escrow Payments", body: "Receive milestone-based payments through Stripe escrow — no more chasing invoices." },
        { name: "Installation Briefs", body: "Receive precise, structured scope documents for every assignment you take on." },
        { name: "Document Access", body: "Access the drawings, specifications, and contracts relevant to your scope." },
        { name: "Approval Tracking", body: "See the real-time status of every sign-off your work depends on." },
      ]}
    />
  );
}
