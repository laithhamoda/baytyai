import Link from 'next/link';

import { cn } from '@/lib/utils';

const TABS = [
  { href: '/dashboard/settings/organization', label: 'Organization' },
  { href: '/dashboard/settings/members', label: 'Members' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Manage your organization preferences.</p>
      </div>
      <nav className="flex gap-1 border-b border-border">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              '-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors',
              'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div>{children}</div>
    </div>
  );
}
