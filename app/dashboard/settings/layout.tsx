import Link from 'next/link';

const TABS = [
  { href: '/dashboard/settings/organization', label: 'Organization' },
  { href: '/dashboard/settings/members', label: 'Members' },
  { href: '/dashboard/settings/billing', label: 'Billing' },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-foreground text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Manage your organization preferences and team.
        </p>
      </div>
      <nav className="border-border -mb-6 flex gap-0 border-b">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="text-muted-foreground hover:text-foreground -mb-px border-b-2 border-transparent px-4 py-2 text-sm font-medium transition-colors"
          >
            {t.label}
          </Link>
        ))}
      </nav>
      <div className="pt-2">{children}</div>
    </div>
  );
}
