import type { Metadata } from "next";
import PricingROI from "@/components/sections/pricing-roi";
import PricingCards from "@/components/sections/pricing-cards";
import SecurityBadges from "@/components/sections/security-badges";
import PricingFAQ from "@/components/sections/pricing-faq";
import { FAQ_ITEMS } from "@/components/sections/faq-data";

export const metadata: Metadata = {
  title: { absolute: "Construction Software Pricing UAE — From AED 159/mo, Bayty" },
  description:
    "Transparent membership pricing for UAE and GCC construction firms. Starter from AED 159/month. No setup fees. No hidden charges. Cancel anytime.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_ITEMS.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function PricingPage() {
  return (
    <div style={{ paddingTop: "72px" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PricingROI />
      <PricingCards />
      <SecurityBadges />
      <PricingFAQ />
    </div>
  );
}
