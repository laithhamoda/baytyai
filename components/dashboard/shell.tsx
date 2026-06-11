'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderPlus,
  FileText,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/projects/new', label: 'New Project', icon: FolderPlus },
  { href: '/dashboard/projects', label: 'My Projects', icon: FileText },
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
          ? 'bg-primary/10 text-primary font-medium'
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
          <span className="font-display text-xl font-semibold text-primary tracking-wide">
            Bayty
          </span>
          <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-primary">
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
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
        {NAV.map((item) => (
          <NavItem key={item.href} {...item} onClick={() => setSidebarOpen(false)} />
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-border px-4 py-4">
        <div className="mb-2 truncate text-xs text-muted-foreground">
          {user.email}
        </div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-sm px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
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
            onKeyDown={(e) => { if (e.key === 'Escape' || e.key === 'Enter') setSidebarOpen(false); }}
          />
          <div className="absolute inset-y-0 start-0 w-60 z-50">{sidebar}</div>
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
          <div className="text-xs text-muted-foreground hidden sm:block">
            {user.email}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
