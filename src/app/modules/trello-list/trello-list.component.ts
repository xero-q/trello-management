/**
 * @class TrelloListComponent
 * @description Component that displays and manages a Trello list and its cards
 */
import { Component, inject, input, OnInit, signal } from '@angular/core';
import { TrelloCardComponent } from '../trello-card/trello-card.component';
import { Router } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { FormCardComponent } from '../../core/components/form-card/form-card.component';
import TrelloList from '../../shared/interfaces/trello-list';
import { TrelloService } from '../../core/services/trello.service';
import { StateService } from '../../core/services/state.service';
import TrelloCard from '../../shared/interfaces/trello-card';
import ROUTES from '../../shared/constants/routes';

/**
 * Component that represents a Trello list and its cards
 * Handles card creation, deletion, and updates
 */
@Component({
  selector: 'app-trello-list',
  imports: [
    TrelloCardComponent,
    NgStyle,
    NgIf,
    ModalComponent,
    FormCardComponent,
  ],
  templateUrl: './trello-list.component.html',
  styleUrl: './trello-list.component.scss',
})
export class TrelloListComponent implements OnInit {
  /**
   * Input signal that receives the list data
   * @input
   */
  list = input.required<TrelloList>();

  /**
   * Signal that holds the list of cards
   */
  cardsList = signal<TrelloCard[]>([]);

  /**
   * Flag controlling the visibility of the card creation form
   */
  displayCardForm = signal(false);

  /**
   * Service for Trello API interactions
   */
  readonly trelloService = inject(TrelloService);

  /**
   * Service for managing application state
   */
  readonly stateService = inject(StateService);

  /**
   * Navigation service
   */
  readonly router = inject(Router);

  /**
   * Toast notification service
   */
  readonly toastr = inject(ToastrService);

  /**
   * Lifecycle hook that initializes the component
   */
  ngOnInit(): void {
    this.loadCards();
  }

  /**
   * Loads the cards for the current list from Trello API
   * Updates the cards list and board metrics
   */
  loadCards(): void {
    this.trelloService.getCards(this.list().id).subscribe({
      next: (cards: TrelloCard[]) => {
        this.cardsList.set(cards);
        this.stateService.addBoardMetrics(
          this.list().idBoard,
          this.list().id,
          this.list().name,
          cards.map((card) => {
            return { name: card.name, description: card.desc };
          })
        );
      },
      error: () => {
        this.toastr.error('Error loading cards');
      },
    });
  }

  /**
   * Handles card click
   * @param cardId - ID of the card to navigate to
   */
  onCardClick(cardId: string) {
    this.router.navigate(['/' + ROUTES.TRELLO_CARD, cardId]);
  }

  /**
   * Opens the card creation form
   */
  openModal(): void {
    this.displayCardForm.set(true);
  }

  /**
   * Closes the card creation form
   */
  closeModal(): void {
    this.displayCardForm.set(false);
  }

  /**
   * Handles card creation success
   * Reloads cards and hides the form
   */
  onCardAddedAndClose(): void {
    this.loadCards();
    this.closeModal();
  }
}
