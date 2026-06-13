import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganizationService } from '../../../core/services/organization.service';
import { MemberRole } from '../../../core/models/organization.models';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="members-container">
      <h2>Team Members</h2>
      <div class="invite-form">
        <h3>Invite a Member</h3>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" placeholder="colleague@company.com" />
        </div>
        <div class="form-group">
          <label>Role</label>
          <select [(ngModel)]="role">
            <option [value]="MemberRole.Admin">Admin</option>
            <option [value]="MemberRole.Member">Member</option>
          </select>
        </div>
        <button (click)="sendInvite()" [disabled]="loading">
          {{ loading ? 'Sending...' : 'Send Invite' }}
        </button>
        <p *ngIf="success" class="success">Invitation sent!</p>
        <p *ngIf="error" class="error">{{ error }}</p>
      </div>
    </div>
  `
})
export class MembersComponent {
  email = '';
  role: MemberRole = MemberRole.Member;
  MemberRole = MemberRole;
  loading = false;
  success = false;
  error = '';
  orgId = localStorage.getItem('bayty_org_id') ?? '';

  constructor(private orgService: OrganizationService) {}

  sendInvite() {
    if (!this.email.trim()) { this.error = 'Email is required.'; return; }
    this.loading = true;
    this.error = '';
    this.success = false;
    this.orgService.inviteMember(this.orgId, { email: this.email, role: this.role }).subscribe({
      next: () => { this.success = true; this.email = ''; this.loading = false; },
      error: () => { this.error = 'Failed to send invitation.'; this.loading = false; }
    });
  }
}
