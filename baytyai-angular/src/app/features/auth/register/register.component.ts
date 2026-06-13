import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <h1>Create your BaytyAI account</h1>
      <form (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label>First Name</label>
          <input type="text" [(ngModel)]="firstName" name="firstName" required />
        </div>
        <div class="form-group">
          <label>Last Name</label>
          <input type="text" [(ngModel)]="lastName" name="lastName" required />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" required />
        </div>
        <p *ngIf="error" class="error">{{ error }}</p>
        <button type="submit" [disabled]="loading">
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>
      </form>
      <p>Already have an account? <a routerLink="/login">Sign in</a></p>
    </div>
  `
})
export class RegisterComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';
    this.authService.register({ firstName: this.firstName, lastName: this.lastName, email: this.email, password: this.password }).subscribe({
      next: () => this.router.navigate(['/dashboard/setup-org']),
      error: (err) => { this.error = err.error?.[0] ?? 'Registration failed.'; this.loading = false; }
    });
  }
}
