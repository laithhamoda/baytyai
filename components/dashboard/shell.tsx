'use client';

import {
  LayoutDashboard,
  FolderPlus,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  ClipboardCheck,
  Store,
  FileSignature,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import Logo from '@/components/brand/logo';
import { cn } from '@/lib/utils';

import type { User } from '@supabase/supabase-js';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus },
  { href: '/dashboard/projects', label: 'My Projects', icon: FileText },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: Store },
  { href: '/dashboard/selection', label: 'Consultant Selection', icon: ClipboardCheck },
  { href: '/dashboard/documents', label: 'AI Documents', icon: FileSignature },
  { href: '/dashboard/verification', label: 'Verification', icon: ShieldCheck },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function NavItem({
  href,
  label,
  icon: Icon,
  exact,
  onClick,
}: (typeof NAV)[number] & { onClick?: () => void }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 rounded-card px-3 py-2.5 text-sm transition-colors',
        active
          ? 'bg-bayty-50 font-medium text-bayty-600'
          : 'text-steel-500 hover:bg-steel-50 hover:text-steel-900',
      )}
    >
      <Icon size={16} className="shrink-0" />
      {label}
      {active && <ChevronRight size={14} className="ms-auto text-bayty-500" />}
    </Link>
  );
}

export default function DashboardShell({
  user,
  children,
}: {
  user: User;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebar = (
    <aside className="flex h-full flex-col border-e border-steel-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-steel-200 px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={26} />
          <span className="rounded-pill bg-bayty-50 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-bayty-600">
            Pro
          </span>
        </Link>
        <button
          className="ms-auto rounded p-1 text-steel-400 hover:text-steel-900 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-steel-200 p-4">
        <div className="mb-2 truncate text-xs text-steel-500">{user.email}</div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-card p-2 text-sm text-steel-500 transition-colors hover:bg-steel-50 hover:text-steel-900"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-steel-50 text-steel-900">
      {/* Desktop sidebar */}
      <div className="hidden w-60 shrink-0 lg:block">{sidebar}</div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            role="button"
            tabIndex={0}
            aria-label="Close sidebar"
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape' || e.key === 'Enter') setSidebarOpen(false);
            }}
          />
          <div className="absolute inset-y-0 start-0 z-50 w-60">{sidebar}</div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 shrink-0 items-center border-b border-steel-200 bg-white px-4 lg:px-6">
          <button
            className="me-4 rounded p-1.5 text-steel-400 hover:text-steel-900 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="hidden text-xs text-steel-500 sm:block">{user.email}</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
