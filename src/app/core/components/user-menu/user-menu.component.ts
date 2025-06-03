/**
 * @class UserMenuComponent
 * @description Component that provides a user menu with navigation and authentication options
 */
import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';

/**
 * Component that displays a user menu with options for navigation and authentication
 * Handles menu toggle, navigation, and logout functionality
 */
@Component({
  selector: 'app-user-menu',
  imports: [NgIf],
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
})
export class UserMenuComponent {
  /**
   * Flag indicating if the menu is currently open
   */
  isMenuOpen = false;

  /**
   * Constructor that initializes the component with required services
   * @param router - Navigation service
   * @param authService - Authentication service
   * @param stateService - Service for managing application state
   */
  constructor(
    private router: Router,
    private authService: AuthService,
    public stateService: StateService
  ) {}

  /**
   * Toggles the visibility of the menu
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  /**
   * Closes the menu
   */
  closeMenu(): void {
    this.isMenuOpen = false;
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
