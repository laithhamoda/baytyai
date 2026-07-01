'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import Logo from '@/components/brand/logo';

const NAV_LINKS = [
  { label: 'Mega Projects', href: '/mega-projects' },
  { label: 'Product', href: '/product' },
  { label: 'Security', href: '/security' },
  { label: 'Resources', href: '/resources' },
  { label: 'About', href: '/about' },
];

// Routes that render their own chrome (dashboard shell, admin shell, auth
// screens) — the marketing nav must not appear on top of them.
const HIDDEN_PREFIXES = [
  '/dashboard',
  '/admin',
  '/account',
  '/login',
  '/sign-in',
  '/sign-up',
  '/access',
  '/onboarding',
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  // The homepage ('/') ships its own light A1 chrome.
  if (pathname === '/') return null;
  if (HIDDEN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 h-[72px] border-b transition-colors ${
        scrolled
          ? 'border-steel-200 bg-white/95 backdrop-blur'
          : 'border-transparent bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-full max-w-container items-center justify-between px-6 md:px-12"
      >
        <Link href="/" aria-label="BaytyAI home" className="transition-opacity hover:opacity-80">
          <Logo size={30} />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="font-sans text-sm text-steel-600 transition-colors hover:text-bayty-600"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/access"
            className="bg-bayty-500 px-5 py-2.5 font-sans text-sm font-medium text-white transition-colors hover:bg-bayty-600"
          >
            Request Access
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="flex size-10 items-center justify-center text-steel-900 md:hidden"
        >
          <span className="font-mono text-sm">{menuOpen ? '✕' : '☰'}</span>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-steel-200 bg-white p-6 md:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="font-sans text-base text-steel-600 transition-colors hover:text-bayty-600"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/access"
              className="mt-2 bg-bayty-500 px-5 py-3 text-center font-sans text-sm font-medium text-white"
            >
              Request Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
