import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganizationService } from '../../../core/services/organization.service';

@Component({
  selector: 'app-setup-org',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="setup-container">
      <h2>Create Your Organization</h2>
      <p>Set up your organization to start managing construction projects.</p>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Organization Name *</label>
          <input type="text" [(ngModel)]="orgName" name="orgName" required
                 placeholder="e.g. Al Futtaim Construction" />
        </div>
        <p *ngIf="error" class="error">{{ error }}</p>
        <button type="submit" [disabled]="loading" class="btn-primary">
          {{ loading ? 'Creating...' : 'Create Organization' }}
        </button>
      </form>
    </div>
  `
})
export class SetupOrgComponent {
  orgName = '';
  loading = false;
  error = '';

  constructor(private orgService: OrganizationService, private router: Router) {}

  onSubmit() {
    if (!this.orgName.trim()) { this.error = 'Organization name is required.'; return; }
    this.loading = true;
    this.error = '';
    this.orgService.createOrganization({ name: this.orgName }).subscribe({
      next: (org) => {
        localStorage.setItem('bayty_org_id', org.id);
        this.router.navigate(['/dashboard/projects']);
      },
      error: () => { this.error = 'Failed to create organization.'; this.loading = false; }
    });
  }
}
