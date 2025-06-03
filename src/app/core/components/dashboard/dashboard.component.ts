/**
 * @class DashboardComponent
 * @description Main dashboard component that serves as the landing page after authentication
 */
import { Component } from '@angular/core';
import { StateService } from '../../services/state.service';

/**
 * Dashboard component that manages the main application interface
 */
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  /**
   * Constructor that initializes the dashboard state
   * @param stateService - Service for managing application state
   */
  constructor(public stateService: StateService) {
    this.stateService.setSelectedBoard(null);
  }
}
