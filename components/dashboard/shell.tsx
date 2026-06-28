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
          ? 'bg-primary/10 text-primary font-medium'
          : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground',
      )}
    >
      <Icon size={16} className="shrink-0" />
      {label}
      {active && <ChevronRight size={14} className="text-primary ms-auto" />}
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
    <aside className="border-border bg-card flex h-full flex-col border-e">
      {/* Logo */}
      <div className="border-border flex h-16 items-center border-b px-5">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="font-display text-primary text-xl font-semibold tracking-wide">
            Bayty
          </span>
          <span className="bg-primary/10 text-primary rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest">
            Pro
          </span>
        </Link>
        <button
          className="text-muted-foreground hover:text-foreground ms-auto rounded p-1 lg:hidden"
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
      <div className="border-border border-t p-4">
        <div className="text-muted-foreground mb-2 truncate text-xs">{user.email}</div>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="text-muted-foreground hover:bg-muted/40 hover:text-foreground flex w-full items-center gap-2 rounded-sm p-2 text-sm transition-colors"
          >
            <LogOut size={14} />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );

  return (
    <div className="bg-background text-foreground flex h-screen overflow-hidden">
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
        <header className="border-border bg-card flex h-16 shrink-0 items-center border-b px-4 lg:px-6">
          <button
            className="text-muted-foreground hover:text-foreground me-4 rounded p-1.5 lg:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="text-muted-foreground hidden text-xs sm:block">{user.email}</div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
