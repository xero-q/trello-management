/**
 * @class TrelloAccountComponent
 * @description Component that manages Trello account boards and board creation
 */
import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { TrelloService } from '../../services/trello.service';
import { map } from 'rxjs';
import TrelloBoard from '../../../shared/interfaces/trello-board';
import { Router } from '@angular/router';
import { LoaderComponent } from '../loader/loader.component';
import { FormBoardComponent } from '../form-board/form-board.component';
import { NgIf, NgStyle } from '@angular/common';
import { StateService } from '../../services/state.service';
import { ModalComponent } from '../modal/modal.component';
import { ToastrService } from 'ngx-toastr';
import ROUTES from '../../../shared/constants/routes';

/**
 * Component that displays and manages Trello boards for the current user
 * Handles board creation and selection
 */
@Component({
  selector: 'app-trello-account',
  imports: [LoaderComponent, FormBoardComponent, NgStyle, NgIf, ModalComponent],
  templateUrl: './trello-account.component.html',
  styleUrl: './trello-account.component.scss',
})
export class TrelloAccountComponent implements OnInit {
  /**
   * Signal that holds the list of Trello boards
   */
  boardsList: WritableSignal<TrelloBoard[]> = signal([]);

  /**
   * Flag indicating if the component is loading
   */
  isLoading = true;

  /**
   * Flag controlling the visibility of the board creation form
   */
  displayBoardForm = false;

  /**
   * Constructor that initializes the component with required services
   * @param trelloService - Service for Trello API interactions
   * @param router - Navigation service
   * @param stateService - Service for managing application state
   * @param toastr - Toast notification service
   */
  constructor(
    private trelloService: TrelloService,
    private router: Router,
    public stateService: StateService,
    private toastr: ToastrService
  ) {}

  /**
   * Lifecycle hook that initializes the component
   */
  ngOnInit() {
    this.loadBoards();
  }

  /**
   * Loads the user's Trello boards from the API
   * Filters out closed boards and updates the boards list
   */
  loadBoards(): void {
    this.isLoading = true;

    this.trelloService
      .getBoards()
      .pipe(
        map((boards: TrelloBoard[]) => boards.filter((board) => !board.closed))
      )
      .subscribe({
        next: (boards: TrelloBoard[]) => {
          this.boardsList.set(boards);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Error loading boards');
        },
      });
  }

  /**
   * Handles board selection
   * @param event - Event object containing the selected board ID
   */
  onBoardSelected(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;
    if (selectedValue) {
      this.router.navigate(['/' + ROUTES.TRELLO_BOARD, selectedValue]);
    }
  }

  /**
   * Opens the board creation form
   */
  openModal() {
    this.displayBoardForm = true;
  }

  /**
   * Closes the board creation form
   */
  closeModal() {
    this.displayBoardForm = false;
  }

  /**
   * Handles board creation success
   * Reloads boards and hides the form
   */
  onBoardAddedAndClose() {
    this.loadBoards();
    this.closeModal();
  }
}
