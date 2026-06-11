'use client';

import {
  LayoutDashboard,
  FolderPlus,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import type { User } from '@supabase/supabase-js';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus },
  { href: '/dashboard/projects', label: 'My Projects', icon: FileText },
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
        'flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm transition-colors',
        active
          ? 'bg-primary/10 font-medium text-primary'
          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
      )}
    >
      <Icon size={16} className="shrink-0" />
      {label}
      {active && <ChevronRight size={14} className="ms-auto text-primary" />}
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
    <aside className="flex h-full flex-col border-e border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-wide text-primary">
            Bayty
          </span>
          <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
            Pro
          </span>
        </Link>
        <button
          className="ms-auto rounded p-1 text-muted-foreground hover:text-foreground lg:hidden"
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
      <div className="border-t border-border p-4">
        <div className="mb-2 truncate text-xs text-muted-foreground">{user.email}</div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm p-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
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
        <header className="flex h-16 shrink-0 items-center border-b border-border bg-card px-4 lg:px-6">
          <button
            className="me-4 rounded p-1.5 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="hidden text-xs text-muted-foreground sm:block">{user.email}</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
