/**
 * @class AfterAuthComponent
 * @description Component that handles the OAuth callback after Trello authentication
 */
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TrelloService } from '../../services/trello.service';
import User from '../../../shared/interfaces/user';
import { StateService } from '../../services/state.service';
import { AuthService } from '../../services/auth.service';
import ROUTES from '../../../shared/constants/routes';

/**
 * Component that processes the OAuth callback after Trello authentication
 * Manages token handling and user information retrieval
 */
@Component({
  selector: 'app-after-auth',
  imports: [],
  templateUrl: './after-auth.component.html',
  styleUrl: './after-auth.component.scss',
})
export class AfterAuthComponent implements OnInit {
  /**
   * Router service for accessing route parameters
   */
  private readonly route = inject(ActivatedRoute);

  /**
   * Service for handling authentication
   */
  private readonly authService = inject(AuthService);

  /**
   * Service for Trello API interactions
   */
  private readonly trelloService = inject(TrelloService);

  /**
   * Service for managing application state
   */
  private readonly stateService = inject(StateService);

  /**
   * Navigation service
   */
  private readonly router = inject(Router);

  /**
   * Lifecycle hook that initializes the component
   * Handles OAuth token and retrieves user information
   */
  ngOnInit() {
    const token = this.route.snapshot.fragment?.split('=')[1];
    if (token) {
      this.authService.login(token);
      this.trelloService.getUserInfo().subscribe((user: User) => {
        this.stateService.setFullName(user.fullName);
      });
    }
    this.router.navigate(['/' + ROUTES.DASHBOARD]);
  }
}
