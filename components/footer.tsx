'use client';

import { usePathname } from 'next/navigation';

import Logo from '@/components/brand/logo';
import { siteConfig } from '@/lib/siteConfig';

type NavLink = { label: string; href: string; external?: boolean };

const NAV_LINKS: NavLink[] = [
  { label: 'Mega Projects', href: '/mega-projects' },
  { label: 'Product', href: '/product' },
  { label: 'Security', href: '/security' },
  { label: 'Compliance', href: '/compliance' },
  { label: 'Implementation', href: '/implementation' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

// Routes with their own chrome — no marketing footer.
const HIDDEN_PREFIXES = [
  '/dashboard',
  '/admin',
  '/account',
  '/login',
  '/sign-in',
  '/sign-up',
  '/access',
  '/onboarding',
  '/audiences',
  '/documents',
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname === '/') return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-steel-200 bg-white py-16">
      <div className="mx-auto w-full max-w-container px-6 md:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:gap-24">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:max-w-[240px]">
            <Logo size={28} />
            <p className="font-sans text-sm leading-relaxed text-steel-500">{siteConfig.tagline}</p>
          </div>

          {/* Nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    {...(l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="font-sans text-sm text-steel-600 transition-colors hover:text-bayty-600"
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
              className="font-mono text-[11px] uppercase tracking-widest text-bayty-600"
            >
              EN
            </span>
            <span className="font-mono text-[11px] text-steel-300">|</span>
            <a
              href="/ar"
              lang="ar"
              className="font-mono text-[11px] uppercase tracking-widest text-steel-600 transition-colors hover:text-bayty-600"
            >
              AR
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 flex flex-col gap-3 border-t border-steel-200 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-mono text-[11px] text-steel-500">
            © {year} BaytyAI · Global project control platform
          </p>
          <div className="flex flex-wrap gap-6">
            <a
              href="/privacy"
              className="font-mono text-[11px] text-steel-500 transition-colors hover:text-bayty-600"
            >
              Privacy
            </a>
            <a
              href="/terms"
              className="font-mono text-[11px] text-steel-500 transition-colors hover:text-bayty-600"
            >
              Terms
            </a>
            <a
              href="mailto:enterprise@baytyai.com"
              className="font-mono text-[11px] text-steel-500 transition-colors hover:text-bayty-600"
            >
              enterprise@baytyai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
