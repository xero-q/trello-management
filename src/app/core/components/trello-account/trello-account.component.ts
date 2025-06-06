/**
 * @class TrelloAccountComponent
 * @description Component that manages Trello account boards and board creation
 */
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { TrelloService } from '../../services/trello.service';
import { map } from 'rxjs';
import TrelloBoard from '../../../shared/interfaces/trello-board';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { FormBoardComponent } from '../form-board/form-board.component';
import { NgStyle } from '@angular/common';
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
  imports: [LoaderComponent, FormBoardComponent, NgStyle, ModalComponent],
  templateUrl: './trello-account.component.html',
  styleUrl: './trello-account.component.scss',
})
export class TrelloAccountComponent implements OnInit {
  /**
   * Signal that holds the list of Trello boards
   */
  protected readonly boardsList: WritableSignal<TrelloBoard[]> = signal([]);

  /**
   * Flag indicating if the component is loading
   */
  protected readonly isLoading = signal(true);

  /**
   * Flag controlling the visibility of the board creation form
   */
  protected readonly displayBoardForm = signal(false);

  /**
   * Service for handling Trello API interactions
   */
  private readonly trelloService = inject(TrelloService);

  /**
   * Navigation service
   */
  private readonly router = inject(Router);

  /**
   * Service for managing application state
   */
  protected readonly stateService = inject(StateService);

  /**
   *  Toast notification service
   */
  private readonly toastr = inject(ToastrService);
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
    this.isLoading.set(true);

    this.trelloService
      .getBoards()
      .pipe(
        map((boards: TrelloBoard[]) => boards.filter((board) => !board.closed))
      )
      .subscribe({
        next: (boards: TrelloBoard[]) => {
          this.boardsList.set(boards);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
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
    this.displayBoardForm.set(true);
  }

  /**
   * Closes the board creation form
   */
  closeModal() {
    this.displayBoardForm.set(false);
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
