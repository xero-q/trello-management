/**
 * @class LoginComponent
 * @description Component that handles user authentication with Trello OAuth
 */
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { environment } from '../../../../environments/environment';

/**
 * Login component that handles Trello OAuth authentication
 */
@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  /**
   * Initiates Trello OAuth authentication flow
   * Redirects user to Trello's authorization page
   */
  loginToTrello() {
    const apiKey = environment.TRELLO_API_KEY;
    const appUrl = environment.APP_URL;
    const redirectUri = `${appUrl}/after-auth`;
    const trelloAuthUrl = `https://trello.com/1/authorize?expiration=never&name=PlanFlow&scope=read,write&response_type=token&key=${apiKey}&return_url=${encodeURIComponent(
      redirectUri
    )}`;
    window.location.href = trelloAuthUrl;
  }
}
