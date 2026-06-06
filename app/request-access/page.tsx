import type { Metadata } from "next";
import DemoClient from "../demo/demo-client";

export const metadata: Metadata = {
  title: { absolute: "Request Access — Bayty Construction Platform | UAE & GCC" },
  description:
    "Request access to the Bayty platform. Available to verified construction professionals and developers across the UAE and GCC.",
};

export default function RequestAccessPage() {
  return <DemoClient />;
}
