import type { Metadata } from "next";
import SolutionsClient from "./solutions-client";

export const metadata: Metadata = {
  title: { absolute: "Construction Platform for Developers & Contractors UAE — Bayty" },
  description:
    "Bayty gives each construction stakeholder exactly the access and tools their role requires. Role-specific solutions for developers, GMs, engineers, consultants, and contractors.",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
