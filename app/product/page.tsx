import type { Metadata } from "next";
import ProductClient from "./product-client";

export const metadata: Metadata = {
  title: { absolute: "Construction Approval Workflow & Document Hub — Bayty" },
  description:
    "See the Bayty platform in action — verified stakeholders, approval workflows, document management, and professional marketplace for GCC construction.",
};

export default function ProductPage() {
  return <ProductClient />;
}
