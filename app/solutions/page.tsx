import type { Metadata } from "next";
import SolutionsClient from "./solutions-client";

export const metadata: Metadata = {
  title: "Solutions — Bayty for Owners, Engineers & Contractors",
};

export default function SolutionsPage() {
  return <SolutionsClient />;
}
