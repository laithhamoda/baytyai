import type { Metadata } from "next";
import Hero from "@/components/sections/hero";
import Problem from "@/components/sections/problem";
import BeforeAfter from "@/components/sections/before-after";
import HowItWorks from "@/components/sections/how-it-works";
import FeatureTiles from "@/components/sections/feature-tiles";
import AICapabilities from "@/components/sections/ai-capabilities";
import MarketplaceJoin from "@/components/sections/marketplace-join";
import PricingCards from "@/components/sections/pricing-cards";

export const metadata: Metadata = {
  title: { absolute: "Construction Management Software UAE & GCC — Bayty AI" },
  description:
    "The verified construction management platform for UAE and GCC developers. Verified stakeholders, structured approvals, document hub, and a trusted professional marketplace.",
  alternates: {
    canonical: "https://www.baytyai.com",
    languages: {
      en: "https://www.baytyai.com",
      ar: "https://www.baytyai.com/ar",
      "ar-AE": "https://www.baytyai.com/ar",
      "x-default": "https://www.baytyai.com",
    },
  },
  openGraph: {
    url: "https://www.baytyai.com",
  },
};

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <BeforeAfter />
      <HowItWorks />
      <FeatureTiles />
      <AICapabilities />
      <MarketplaceJoin />
      <PricingCards />
    </>
  );
}
