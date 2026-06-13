import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="dashboard-layout">
      <nav class="sidebar">
        <div class="logo">BaytyAI</div>
        <ul>
          <li><a routerLink="/dashboard/projects">Projects</a></li>
          <li><a routerLink="/dashboard/members">Members</a></li>
          <li><a routerLink="/dashboard/kyc">Verify Identity</a></li>
        </ul>
        <div class="user-info">
          <span>{{ user()?.firstName }} {{ user()?.lastName }}</span>
          <button (click)="logout()">Sign Out</button>
        </div>
      </nav>
      <main class="content">
        <router-outlet />
      </main>
    </div>
  `
})
export class DashboardComponent {
  user = this.authService.currentUser;

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
