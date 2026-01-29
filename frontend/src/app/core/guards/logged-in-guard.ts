/**
 * Guard that prevents access to a route if the user is already logged in.
 *
 * - Injects AuthService and Router instances.
 * - If the user is logged in, navigates to the summary page and returns `false` to block access.
 * - If the user is not logged in, returns `true` to allow access.
 */

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const loggedInGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    router.navigate(['/summary']);
    return false;
  }

  return true; 
};