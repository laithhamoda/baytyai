import type { Metadata } from "next";
import Features from "@/components/sections/features";

export const metadata: Metadata = {
  title: "Product — The Bayty Platform",
  description:
    "Explore the Bayty platform — verification, structured approvals, document management, and a trusted marketplace for GCC construction.",
};

export default function ProductPage() {
  return (
    <div style={{ paddingTop: "72px" }}>
      <Features />
    </div>
  );
}
