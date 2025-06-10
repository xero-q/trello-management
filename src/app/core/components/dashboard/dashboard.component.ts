/**
 * @class DashboardComponent
 * @description Main dashboard component that serves as the landing page after authentication
 */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StateService } from '../../services/state.service';
import { AsyncPipe } from '@angular/common';

/**
 * Dashboard component that manages the main application interface
 */
@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  /**
   * Service for managing application state
   */
  protected readonly stateService = inject(StateService);

  constructor() {
    this.stateService.setSelectedBoard(null);
  }
}
