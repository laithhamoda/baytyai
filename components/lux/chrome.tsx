'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const AUDIENCES = [
  { label: 'Client / Owner', href: '/audiences/client' },
  { label: 'Consultant', href: '/audiences/consultant' },
  { label: 'Contractor', href: '/audiences/contractor' },
  { label: 'Subcontractor', href: '/audiences/subcontractor' },
  { label: 'Supplier', href: '/audiences/supplier' },
];

/** Gold-accented BaytyAI wordmark, scoped to the lux marketing chrome. */
function LuxWordmark() {
  return (
    <span className="font-cormorant text-2xl font-medium tracking-tight text-offwhite">
      Bayty<span className="italic text-gold">ai</span>
    </span>
  );
}

export function LuxNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300',
        scrolled ? 'border-gold/20 bg-navy/95 backdrop-blur' : 'border-transparent bg-transparent',
      )}
    >
      <nav
        aria-label="Primary"
        className="mx-auto flex h-[76px] w-full max-w-container items-center justify-between px-6 md:px-10"
      >
        <Link href="/" aria-label="BaytyAI home" className="transition-opacity hover:opacity-80">
          <LuxWordmark />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {AUDIENCES.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="font-dmsans text-sm font-light text-offwhite/70 transition-colors hover:text-gold"
            >
              {a.label}
            </Link>
          ))}
          <Link
            href="/access"
            className="border-[0.5px] border-gold bg-transparent px-5 py-2.5 font-dmmono text-[11px] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold/10"
          >
            Request Access
          </Link>
        </div>

        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex size-10 items-center justify-center text-offwhite lg:hidden"
        >
          <span className="font-dmmono text-sm">{open ? '✕' : '☰'}</span>
        </button>
      </nav>

      {open && (
        <div className="border-t border-gold/20 bg-navy p-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {AUDIENCES.map((a) => (
              <Link
                key={a.href}
                href={a.href}
                onClick={() => setOpen(false)}
                className="font-dmsans text-base font-light text-offwhite/80 transition-colors hover:text-gold"
              >
                {a.label}
              </Link>
            ))}
            <Link
              href="/access"
              onClick={() => setOpen(false)}
              className="mt-2 border-[0.5px] border-gold px-5 py-3 text-center font-dmmono text-[11px] uppercase tracking-[0.18em] text-gold"
            >
              Request Access
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function LuxFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gold/20 bg-navy py-16">
      <div className="mx-auto w-full max-w-container px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <LuxWordmark />
            <p className="mt-4 font-dmsans text-sm font-light leading-relaxed text-offwhite/60">
              The verified governance and control layer for the world&apos;s most complex
              construction programs.
            </p>
          </div>
          <nav aria-label="Audiences">
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold">
              By Stakeholder
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {AUDIENCES.map((a) => (
                <li key={a.href}>
                  <Link
                    href={a.href}
                    className="font-dmsans text-sm font-light text-offwhite/70 transition-colors hover:text-gold"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="font-dmmono text-[11px] uppercase tracking-[0.28em] text-gold">
              Platform
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {[
                { label: 'Request Access', href: '/access' },
                { label: 'Security', href: '/security' },
                { label: 'Compliance', href: '/compliance' },
                { label: 'About', href: '/about' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-dmsans text-sm font-light text-offwhite/70 transition-colors hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-gold/15 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="font-dmmono text-[11px] tracking-wide text-offwhite/50">
            © {year} BaytyAI · Global mega-project control platform
          </p>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="font-dmmono text-[11px] text-offwhite/50 transition-colors hover:text-gold"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="font-dmmono text-[11px] text-offwhite/50 transition-colors hover:text-gold"
            >
              Terms
            </Link>
            <a
              href="mailto:enterprise@baytyai.com"
              className="font-dmmono text-[11px] text-offwhite/50 transition-colors hover:text-gold"
            >
              enterprise@baytyai.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Full-bleed navy shell that hosts a lux marketing page. */
export function LuxShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-navy font-dmsans text-offwhite antialiased">
      <LuxNav />
      <main>{children}</main>
      <LuxFooter />
    </div>
  );
}
