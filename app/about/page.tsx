import type { Metadata } from "next";
import AboutClient from "./about-client";

export const metadata: Metadata = {
  title: "About Bayty — Modernising Construction in the Gulf",
};

export default function AboutPage() {
  return <AboutClient />;
}
