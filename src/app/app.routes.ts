import { Routes } from '@angular/router';
import { authGuard, guestGuard, roleGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
    canActivate: [guestGuard]
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./components/verify-otp/verify-otp.component').then(m => m.VerifyOtpComponent)
  },
  {
    path: 'verify-email',
    loadComponent: () => import('./components/verify-email/verify-email.component').then(m => m.VerifyEmailComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./components/dashboards/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [roleGuard([UserRole.Administrator])]
  },
  {
    path: 'field-agent/dashboard',
    loadComponent: () => import('./components/dashboards/field-agent-dashboard.component').then(m => m.FieldAgentDashboardComponent),
    canActivate: [roleGuard([UserRole.FieldAgent])]
  },
  {
    path: 'finance/dashboard',
    loadComponent: () => import('./components/dashboards/finance-dashboard.component').then(m => m.FinanceDashboardComponent),
    canActivate: [roleGuard([UserRole.FinanceUser])]
  },
  {
    path: 'it-support/dashboard',
    loadComponent: () => import('./components/dashboards/it-support-dashboard.component').then(m => m.ITSupportDashboardComponent),
    canActivate: [roleGuard([UserRole.ITSupportUser])]
  },
  {
    path: 'user/dashboard',
    loadComponent: () => import('./components/dashboards/user-dashboard.component').then(m => m.UserDashboardComponent),
    canActivate: [roleGuard([UserRole.User])]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
