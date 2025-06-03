/**
 * @file auth.guard.ts
 * @description Route guard that prevents access to protected routes if the user is not authenticated.
 *              Redirects unauthenticated users to the login page.
 */

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import ROUTES from '../../shared/constants/routes';

/**
 * Authentication guard function that determines whether a route can be activated
 * based on the presence of a valid authentication token.
 *
 * @returns {boolean} `true` if the user is authenticated; otherwise, redirects to the login page and returns `false`.
 *
 * @example
 * // In your route definition
 * {
 *   path: 'dashboard',
 *   canActivate: [authGuard],
 *   component: DashboardComponent
 * }
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    return true;
  } else {
    const router = inject(Router);
    router.navigate(['/' + ROUTES.LOGIN]);
    return false;
  }
};
