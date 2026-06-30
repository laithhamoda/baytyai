'use client';

import { usePathname } from 'next/navigation';

import Logo from '@/components/brand/logo';
import { siteConfig } from '@/lib/siteConfig';

type NavLink = { label: string; href: string; external?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: 'System', href: '/#system' },
  { label: 'Pricing', href: '/#pricing' },
  { label: 'FAQ', href: '/#faq' },
  { label: 'GCC FM Prompt Series', href: siteConfig.founder.linkedin, external: true },
  { label: 'About', href: '/about' },
];

// Routes with their own chrome — no marketing footer.
const HIDDEN_PREFIXES = ['/dashboard', '/admin', '/account', '/login', '/sign-in', '/sign-up'];

export default function Footer() {
  const pathname = usePathname();
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-700 bg-ink-950 py-16">
      <div className="mx-auto w-full max-w-container px-6 md:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:gap-24">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:max-w-[240px]">
            <Logo tone="light" size={28} />
            <p className="font-sans text-sm leading-relaxed text-ink-500">{siteConfig.tagline}</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="font-sans text-sm text-ink-300 transition-colors hover:text-signal-500"
                  >
                    {l.label}
                    {l.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Locale toggle */}
          <div className="flex items-start gap-3 md:ml-auto">
            <span
              aria-current="true"
              className="font-mono text-[11px] uppercase tracking-widest text-signal-500"
            >
              EN
            </span>
            <span className="font-mono text-[11px] text-ink-700">|</span>
            <a
              href="/ar"
              lang="ar"
              className="font-mono text-[11px] uppercase tracking-widest text-ink-300 transition-colors hover:text-signal-500"
            >
              AR
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col gap-3 border-t border-ink-700 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] text-ink-500">© {year} BaytyAI · Amman, Jordan</p>
          <div className="flex flex-wrap gap-6">
            <a
              href="/privacy"
              className="font-mono text-[11px] text-ink-500 transition-colors hover:text-signal-500"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="font-mono text-[11px] text-ink-500 transition-colors hover:text-signal-500"
            >
              Terms
            </a>
            <a
              href="mailto:founder@baytyai.com"
              className="font-mono text-[11px] text-ink-500 transition-colors hover:text-signal-500"
            >
              founder@baytyai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
