import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Platform Demo | BaytyAI',
  description:
    'Explore BaytyAI end-to-end: verified identity onboarding, AI-drafted bilingual FIDIC documents, RFI approval routing with SLA tracking, and interim payment applications — on a live mega-project scenario.',
  robots: { index: false, follow: false },
  alternates: { canonical: 'https://www.baytyai.com/demo/platform' },
};

/**
 * Interactive product prototype. It is a fully self-contained HTML/CSS/JS
 * experience with its own app shell, so we render it in a sandboxed full-screen
 * iframe — this isolates its global styles and scripts from the Next app and
 * avoids any class-name collisions with Tailwind.
 */
export default function PlatformDemoPage() {
  return (
    <iframe
      src="/demo/platform.html"
      title="BaytyAI interactive platform demo"
      className="fixed inset-0 h-screen w-screen border-0"
      sandbox="allow-scripts allow-same-origin"
    />
  );
}
