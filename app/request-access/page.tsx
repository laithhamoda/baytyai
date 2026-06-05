import type { Metadata } from "next";
import DemoClient from "../demo/demo-client";

export const metadata: Metadata = {
  title: "Request Private Access — Bayty",
  description:
    "Request a private introduction to the Bayty platform. Available to verified construction professionals and developers across the GCC.",
};

export default function RequestAccessPage() {
  return <DemoClient />;
}
