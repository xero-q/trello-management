/**
 * @class RedirectComponent
 * @description Component that handles application routing based on authentication state
 */
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import ROUTES from '../../../shared/constants/routes';

/**
 * Component that redirects users to appropriate routes based on authentication
 * Redirects to dashboard if authenticated, otherwise to login page
 */
@Component({
  selector: 'app-redirect',
  imports: [],
  templateUrl: './redirect.component.html',
  styleUrl: './redirect.component.scss',
})
export class RedirectComponent {
  /**
   * Service for Authentication interactions
   */
  private readonly authService = inject(AuthService);

  /**
   * Service for Navigation
   */
  private readonly router = inject(Router);

  /**
   * Constructor that handles the redirection logic
   * Checks authentication state and redirects accordingly
   */
  constructor() {
    const token = this.authService.getToken();

    this.router.navigate([token ? '/' + ROUTES.DASHBOARD : '/' + ROUTES.LOGIN]);
  }
}
