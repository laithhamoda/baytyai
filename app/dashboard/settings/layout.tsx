import Link from 'next/link';

const TABS = [
  { href: '/dashboard/settings/organization', label: 'Organization' },
  { href: '/dashboard/settings/members',      label: 'Members'      },
  { href: '/dashboard/settings/billing',      label: 'Billing'      },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your organization preferences and team.
        </p>
      </div>
      <nav className="flex gap-0 border-b border-border -mb-6">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground border-b-2 border-transparent -mb-px"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="pt-2">{children}</div>
    </div>
  );
}
