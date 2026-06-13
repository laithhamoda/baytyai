import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="wizard-container">
      <div class="wizard-progress">
        <div *ngFor="let step of steps; let i = index"
             class="step" [class.active]="currentStep === i + 1" [class.done]="currentStep > i + 1">
          {{ i + 1 }}
        </div>
      </div>

      <!-- Step 1: Project basics -->
      <div *ngIf="currentStep === 1" class="step-content">
        <h2>Project Details</h2>
        <div class="form-group">
          <label>Project Title *</label>
          <input type="text" [(ngModel)]="form.title" placeholder="e.g. Villa Construction - Dubai" />
        </div>
        <div class="form-group">
          <label>Project Type *</label>
          <select [(ngModel)]="form.projectType">
            <option value="">Select type</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
            <option value="infrastructure">Infrastructure</option>
          </select>
        </div>
        <div class="form-group">
          <label>Location *</label>
          <input type="text" [(ngModel)]="form.location" placeholder="e.g. Dubai Marina, UAE" />
        </div>
        <div class="form-group">
          <label>Budget (AED)</label>
          <input type="number" [(ngModel)]="form.budgetAed" />
        </div>
      </div>

      <!-- Step 2: Description -->
      <div *ngIf="currentStep === 2" class="step-content">
        <h2>Project Description</h2>
        <div class="form-group">
          <label>Description</label>
          <textarea [(ngModel)]="form.description" rows="6" placeholder="Describe your project..."></textarea>
        </div>
      </div>

      <!-- Steps 3-5: Additional info -->
      <div *ngIf="currentStep >= 3" class="step-content">
        <h2>Step {{ currentStep }} of {{ steps.length }}</h2>
        <p>Additional project configuration for step {{ currentStep }}.</p>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>

      <div class="wizard-actions">
        <button *ngIf="currentStep > 1" (click)="prevStep()">Back</button>
        <button *ngIf="currentStep < steps.length" (click)="nextStep()" [disabled]="loading">
          {{ loading ? 'Saving...' : 'Next' }}
        </button>
        <button *ngIf="currentStep === steps.length" (click)="submit()" [disabled]="loading" class="btn-primary">
          {{ loading ? 'Submitting...' : 'Submit Project' }}
        </button>
      </div>
    </div>
  `
})
export class ProjectWizardComponent {
  steps = [1, 2, 3, 4, 5];
  currentStep = 1;
  loading = false;
  error = '';
  projectId: string | null = null;
  orgId = localStorage.getItem('bayty_org_id') ?? '';

  form = {
    title: '',
    projectType: '',
    location: '',
    budgetAed: null as number | null,
    description: ''
  };

  constructor(private projectService: ProjectService, private router: Router) {}

  nextStep() {
    if (this.currentStep === 1 && !this.projectId) {
      this.createAndSave();
    } else {
      this.saveCurrentStep();
    }
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  private createAndSave() {
    if (!this.form.title || !this.form.projectType || !this.form.location) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.loading = true;
    this.error = '';
    this.projectService.createProject(this.orgId, {
      title: this.form.title,
      projectType: this.form.projectType,
      location: this.form.location,
      budgetAed: this.form.budgetAed ?? undefined,
      description: this.form.description
    }).subscribe({
      next: (project) => {
        this.projectId = project.id;
        this.currentStep++;
        this.loading = false;
      },
      error: () => { this.error = 'Failed to create project.'; this.loading = false; }
    });
  }

  private saveCurrentStep() {
    this.loading = true;
    this.projectService.saveStep(this.orgId, this.projectId!, {
      stepNumber: this.currentStep,
      dataJson: JSON.stringify({ step: this.currentStep })
    }).subscribe({
      next: () => { this.currentStep++; this.loading = false; },
      error: () => { this.error = 'Failed to save step.'; this.loading = false; }
    });
  }

  submit() {
    this.loading = true;
    this.projectService.submitProject(this.orgId, this.projectId!).subscribe({
      next: () => this.router.navigate(['/dashboard/projects']),
      error: () => { this.error = 'Failed to submit project.'; this.loading = false; }
    });
  }
}
