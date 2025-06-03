import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import ROUTES from './shared/constants/routes';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./core/components/redirect/redirect.component').then(
        (m) => m.RedirectComponent
      ),
  },
  {
    path: ROUTES.LOGIN,
    loadComponent: () =>
      import('./core/components/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: ROUTES.AFTER_AUTH,
    loadComponent: () =>
      import('./core/components/after-auth/after-auth.component').then(
        (m) => m.AfterAuthComponent
      ),
  },
  {
    path: ROUTES.DASHBOARD,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./core/components/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: `${ROUTES.TRELLO_BOARD}/:id`,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/trello-board/trello-board.component').then(
        (m) => m.TrelloBoardComponent
      ),
  },
  {
    path: `${ROUTES.TRELLO_CARD}/:id`,
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/trello-card/trello-card.component').then(
        (m) => m.TrelloCardComponent
      ),
  },
];
