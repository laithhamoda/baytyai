import Link from 'next/link';
import { getProjects } from '@/app/actions/projects/get-projects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { FolderPlus, ArrowRight } from 'lucide-react';

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

const STATUS_LABEL: Record<string, string> = {
  draft: 'Draft',
  submitted: 'Submitted',
  under_review: 'Under Review',
  information_requested: 'Info Requested',
  approved: 'Approved',
  active: 'Active',
  archived: 'Archived',
};

export default async function DashboardPage() {
  const result = await getProjects();
  const projects = result.success ? result.data : [];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your project intake requests
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/projects/new">
            <FolderPlus size={15} className="me-2" />
            New Project
          </Link>
        </Button>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-sm border border-dashed border-border bg-card py-20 text-center">
          <FolderPlus size={36} className="mb-4 text-muted-foreground/50" />
          <p className="text-sm font-medium text-foreground">No projects yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Submit your first project intake request to get started.
          </p>
          <Button asChild className="mt-6" size="sm">
            <Link href="/dashboard/projects/new">
              Start a new project
            </Link>
          </Button>
        </div>
      )}

      {/* Table */}
      {projects.length > 0 && (
        <div className="rounded-sm border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project</TableHead>
                <TableHead>Reference</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Step</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">
                    {p.project_name_en ?? (
                      <span className="text-muted-foreground italic">Unnamed draft</span>
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.reference_number ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={p.status as Parameters<typeof Badge>[0]['variant']}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {p.status === 'draft' ? `${p.current_step} / 5` : '—'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {fmtDate(p.updated_at)}
                  </TableCell>
                  <TableCell>
                    {p.status === 'draft' && (
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/dashboard/projects/new?id=${p.id}`}>
                          Continue <ArrowRight size={13} className="ms-1" />
                        </Link>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
