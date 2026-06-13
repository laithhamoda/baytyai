import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="kyc-container">
      <h2>Verify Your Identity</h2>
      <p>KYC verification is required to access all platform features.</p>

      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>Full Legal Name *</label>
          <input type="text" [(ngModel)]="fullLegalName" name="fullLegalName" required
                 placeholder="As it appears on your ID" />
        </div>
        <div class="form-group">
          <label>National ID / Emirates ID *</label>
          <input type="text" [(ngModel)]="nationalId" name="nationalId" required
                 placeholder="784-XXXX-XXXXXXX-X" />
        </div>
        <p *ngIf="error" class="error">{{ error }}</p>
        <p *ngIf="success" class="success">KYC submitted successfully. We'll review within 1-2 business days.</p>
        <button type="submit" [disabled]="loading" class="btn-primary">
          {{ loading ? 'Submitting...' : 'Submit for Verification' }}
        </button>
      </form>
    </div>
  `
})
export class KycComponent {
  fullLegalName = '';
  nationalId = '';
  loading = false;
  success = false;
  error = '';

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (!this.fullLegalName.trim() || !this.nationalId.trim()) {
      this.error = 'All fields are required.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.http.post(`${environment.apiUrl}/kyc/submit`, {
      fullLegalName: this.fullLegalName,
      nationalId: this.nationalId
    }).subscribe({
      next: () => { this.success = true; this.loading = false; },
      error: () => { this.error = 'Submission failed. Please try again.'; this.loading = false; }
    });
  }
}
