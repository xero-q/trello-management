/**
 * @class UserMenuComponent
 * @description Component that provides a user menu with navigation and authentication options
 */
import { Component, HostListener, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';

/**
 * Component that displays a user menu with options for navigation and authentication
 * Handles menu toggle, navigation, and logout functionality
 */
@Component({
  selector: 'app-user-menu',
  imports: [],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  /**
   * Flag indicating if the menu is currently open
   */
  protected readonly isMenuOpen = signal(false);

  /**
   * Navigation service
   */
  private readonly router = inject(Router);

  /**
   * Service for managing application state
   */
  protected readonly stateService = inject(StateService);

  /**
   * Service for managing Authentication state
   */
  protected readonly authService = inject(AuthService);

  /**
   * Toggles the visibility of the menu
   */
  toggleMenu(): void {
    this.isMenuOpen.update((value) => !value);
  }

  /**
   * Closes the menu
   */
  closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  /**
   * Navigates to the dashboard page
   */
  navigateToDashboard(): void {
    this.router.navigate(['/dashboard']);
    this.closeMenu();
  }

  /**
   * Handles user logout
   * Clears authentication and redirects to login page
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
    this.closeMenu();
  }

  /**
   * Handles clicks outside the menu to close it
   * @param event - Mouse event object
   */
  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu')) {
      this.closeMenu();
    }
  }

  /**
   * Handles Enter or Space on Dashboard
   * @param event - Keyboard event object
   */
  onKeydownDashboard(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.navigateToDashboard();
    }
  }

  /**
   * Handles Enter or Space on Logout
   * @param event - Keyboard event object
   */
  onKeydownLogout(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.logout();
    }
  }
}
