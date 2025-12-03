import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Check if route requires specific roles
  const requiredRoles = route.data['roles'] as UserRole[] | undefined;
  
  if (requiredRoles && requiredRoles.length > 0) {
    if (!authService.hasAnyRole(requiredRoles)) {
      // Redirect to user's appropriate dashboard
      const user = authService.getCurrentUser();
      if (user) {
        router.navigate([authService.getRoleDashboardRoute(user.role)]);
      } else {
        router.navigate(['/unauthorized']);
      }
      return false;
    }
  }

  return true;
};

export const guestGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    if (user) {
      router.navigate([authService.getRoleDashboardRoute(user.role)]);
    }
    return false;
  }

  return true;
};

export const roleGuard = (roles: UserRole[]): CanActivateFn => {
  return (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    if (!authService.hasAnyRole(roles)) {
      const user = authService.getCurrentUser();
      if (user) {
        router.navigate([authService.getRoleDashboardRoute(user.role)]);
      } else {
        router.navigate(['/unauthorized']);
      }
      return false;
    }

    return true;
  };
};
