import type { Metadata } from "next";
import Script from "next/script";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import PricingCards from "@/components/sections/pricing-cards";

export const metadata: Metadata = {
  title: "Bayty — Luxury Construction Management Platform for the GCC",
  description:
    "The verified, end-to-end construction management platform connecting project owners, engineers, consultants and contractors across the UAE and GCC.",
  alternates: {
    canonical: "https://www.baytyai.com",
  },
  openGraph: {
    url: "https://www.baytyai.com",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bayty",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: "https://www.baytyai.com",
  description:
    "The verified, end-to-end construction management platform connecting project owners, engineers, consultants and contractors across the UAE and GCC.",
  offers: {
    "@type": "Offer",
    price: "199",
    priceCurrency: "AED",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "199",
      priceCurrency: "AED",
      billingDuration: "P1M",
    },
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="json-ld-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <Features />
      <PricingCards />
    </>
  );
}
