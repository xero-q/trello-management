/**
 * @class AuthService
 * @description Service that handles user authentication and token management
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

/**
 * Service that manages user authentication state and token storage
 * Provides methods for login, logout, and token retrieval
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * Private BehaviorSubject that tracks authentication state
   * @private
   */
  private isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getToken());

  /**
   * Observable that emits the current authentication state
   * @readonly
   */
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * Constructor that initializes authentication state
   * @param platformId - Platform ID for browser detection
   */
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.isLoggedInSubject.next(!!this.getToken());
  }

  /**
   * Handles user login by storing the authentication token
   * @param token - Trello authentication token
   */
  login(token: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('trello_token', token);
      this.isLoggedInSubject.next(true);
    }
  }

  /**
   * Retrieves the stored authentication token
   * @returns Trello authentication token or null if not logged in
   */
  getToken() {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('trello_token');
    }
    return null;
  }

  /**
   * Handles user logout by clearing all stored data
   */
  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.clear();
    }
    this.isLoggedInSubject.next(false);
  }
}
