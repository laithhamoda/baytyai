import type { Metadata } from "next";
import PricingCards from "@/components/sections/pricing-cards";

export const metadata: Metadata = {
  title: "Pricing — Bayty Membership Tiers",
  description:
    "Choose the right Bayty membership for your portfolio. Transparent pricing for contractors, firms, and developers across the GCC.",
};

export default function PricingPage() {
  return (
    <div style={{ paddingTop: "72px" }}>
      <PricingCards />
    </div>
  );
}
