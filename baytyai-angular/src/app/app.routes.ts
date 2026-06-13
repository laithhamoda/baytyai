import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: 'projects',
        loadComponent: () => import('./features/projects/project-list/project-list.component').then(m => m.ProjectListComponent)
      },
      {
        path: 'projects/new',
        loadComponent: () => import('./features/projects/project-wizard/project-wizard.component').then(m => m.ProjectWizardComponent)
      },
      {
        path: 'setup-org',
        loadComponent: () => import('./features/organizations/setup/setup-org.component').then(m => m.SetupOrgComponent)
      },
      {
        path: 'members',
        loadComponent: () => import('./features/organizations/members/members.component').then(m => m.MembersComponent)
      },
      {
        path: 'kyc',
        loadComponent: () => import('./features/kyc/kyc.component').then(m => m.KycComponent)
      }
    ]
  },
  { path: '**', redirectTo: '/dashboard' }
];
