/**
 * @class AppComponent
 * @description Root component of the PlanFlow application
 */
import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TrelloAccountComponent } from './core/components/trello-account/trello-account.component';
import { UserMenuComponent } from './core/components/user-menu/user-menu.component';
import { AuthService } from './core/services/auth.service';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformServer, NgIf } from '@angular/common';

/**
 * Root component that serves as the main container for the application
 * Manages authentication state and sets up SEO metadata
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, TrelloAccountComponent, UserMenuComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  /**
   * Application title
   */
  title = 'PlanFlow';

  /**
   * Current year for copyright information
   */
  currentYear: number = new Date().getFullYear();

  /**
   * Injected authentication service
   */
  authService = inject(AuthService);

  /**
   * Flag indicating if the user is logged in
   */
  isLoggedIn = !!this.authService.getToken();

  /**
   * Constructor that initializes the component with required services
   * @param meta - Service for managing meta tags
   * @param titleService - Service for managing page title
   */
  constructor(
    private meta: Meta,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformServer(this.platformId)) {
      this.titleService.setTitle('PlanFlow');
      this.meta.addTags([
        {
          name: 'description',
          content: 'This App allows to manage your Trello account',
        },
        {
          name: 'keywords',
          content: 'Trello, Angular, web, development, Anibal Sanchez',
        },
        { name: 'author', content: 'Anibal Sanchez Numa' },
      ]);
    }
  }

  /**
   * Lifecycle hook that initializes the component
   * Sets up authentication state subscription and SEO metadata
   */
  ngOnInit() {
    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }
}
