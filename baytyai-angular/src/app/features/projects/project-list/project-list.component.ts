import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';
import { ProjectDto, ProjectStatus } from '../../../core/models/project.models';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page-header">
      <h2>Projects</h2>
      <a routerLink="/dashboard/projects/new" class="btn-primary">+ New Project</a>
    </div>

    <div *ngIf="loading">Loading projects...</div>
    <div *ngIf="!loading && projects.length === 0" class="empty-state">
      <p>No projects yet. Create your first project.</p>
    </div>

    <div class="project-grid">
      <div *ngFor="let project of projects" class="project-card">
        <h3>{{ project.title }}</h3>
        <p>{{ project.projectType }} · {{ project.location }}</p>
        <span class="badge" [class]="'status-' + project.status">
          {{ getStatusLabel(project.status) }}
        </span>
        <p class="meta">Created {{ project.createdAt | date:'mediumDate' }}</p>
      </div>
    </div>
  `
})
export class ProjectListComponent implements OnInit {
  projects: ProjectDto[] = [];
  loading = true;
  orgId = localStorage.getItem('bayty_org_id') ?? '';

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    if (!this.orgId) { this.loading = false; return; }
    this.projectService.getProjects(this.orgId).subscribe({
      next: (data) => { this.projects = data; this.loading = false; },
      error: () => { this.loading = false; }
    });
  }

  getStatusLabel(status: ProjectStatus): string {
    return ProjectStatus[status];
  }
}
