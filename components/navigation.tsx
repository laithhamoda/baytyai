'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { track, getSessionId } from '@/lib/analytics';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { label: 'Product', href: '/product' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{
          borderBottom: scrolled ? '0.5px solid rgba(201,168,76,0.3)' : '0.5px solid transparent',
          backgroundColor: scrolled ? '#0A1628' : 'transparent',
          transition: 'background-color 0.3s ease, border-color 0.3s ease',
        }}
        className="fixed inset-x-0 top-0 z-50 h-[72px]"
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-8">
          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-display)',
              color: '#C9A84C',
              letterSpacing: '0.25em',
              fontWeight: 600,
              fontSize: '1.125rem',
            }}
          >
            BAYTY
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '13px',
                    fontWeight: 400,
                    letterSpacing: '0.12em',
                    color: active ? '#C9A84C' : '#F8F6F1',
                    textTransform: 'uppercase',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#F8F6F1';
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-7 md:flex">
            <Link
              href="/login"
              data-testid="nav-signin"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '13px',
                fontWeight: 400,
                color: '#F8F6F1',
                letterSpacing: '0.08em',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#C9A84C';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#F8F6F1';
              }}
            >
              Sign In
            </Link>

            <RequestAccessButton />
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="flex flex-col items-center justify-center gap-[5px] md:hidden"
          >
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#C9A84C',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#C9A84C',
                transition: 'opacity 0.3s ease',
                opacity: menuOpen ? 0 : 1,
              }}
            />
            <span
              style={{
                display: 'block',
                width: '22px',
                height: '1px',
                backgroundColor: '#C9A84C',
                transition: 'transform 0.3s ease, opacity 0.3s ease',
                transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
              }}
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ backgroundColor: '#0A1628' }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-10 md:hidden"
          >
            {NAV_LINKS.map(({ label, href }, i) => {
              const active = pathname === href;
              return (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.07, ease: 'easeOut' }}
                >
                  <Link
                    href={href}
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '2rem',
                      fontWeight: 300,
                      letterSpacing: '0.15em',
                      color: active ? '#C9A84C' : '#F8F6F1',
                      textTransform: 'uppercase',
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: NAV_LINKS.length * 0.07, ease: 'easeOut' }}
              className="mt-4 flex flex-col items-center gap-6"
            >
              <Link
                href="/login"
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#F8F6F1',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}
              >
                Sign In
              </Link>
              <RequestAccessButton />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RequestAccessButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/request-access"
      data-testid="nav-request-access"
      onClick={() => track({ name: 'signup_click',
        props: { source: 'header', sessionId: getSessionId(), page: '/', elementId: 'nav-request-access' } })}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '13px',
        fontWeight: 400,
        letterSpacing: '0.12em',
        textTransform: 'uppercase' as const,
        color: hovered ? '#0A1628' : '#C9A84C',
        backgroundColor: hovered ? '#C9A84C' : 'transparent',
        border: '0.5px solid #C9A84C',
        padding: '10px 24px',
        display: 'inline-block',
        transition: 'color 0.25s ease, background-color 0.25s ease',
      }}
    >
      Request Access
    </Link>
  );
}
