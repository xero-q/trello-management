/**
 * @class TrelloCardComponent
 * @description Component that displays and manages a single Trello card
 */
import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgStyle } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { LoaderComponent } from '../../core/components/loader/loader.component';
import { ModalComponent } from '../../core/components/modal/modal.component';
import { FormCardComponent } from '../../core/components/form-card/form-card.component';
import TrelloCard from '../../shared/interfaces/trello-card';
import { TrelloService } from '../../core/services/trello.service';
import { StateService } from '../../core/services/state.service';
import { MarkdownModule } from 'ngx-markdown';
import ROUTES from '../../shared/constants/routes';

/**
 * Component that displays and manages a single Trello card
 * Handles card loading, editing, and deletion
 */
@Component({
  selector: 'app-trello-card',
  imports: [
    MarkdownModule,
    LoaderComponent,
    ModalComponent,
    FormCardComponent,
    NgStyle,
    NgIf,
  ],
  templateUrl: './trello-card.component.html',
  styleUrl: './trello-card.component.scss',
})
export class TrelloCardComponent implements OnInit {
  /**
   * Input property that receives the card data
   * @input
   */
  @Input() card: TrelloCard | null = null;

  /**
   * Current card ID
   */
  cardId: string | null = null;

  /**
   * Flag indicating if the component is loading
   */
  isLoading = signal(true);

  /**
   * Flag controlling the visibility of the card edit form
   */
  displayCardForm = signal(false);

  /**
   * Service for Trello API interactions
   */
  readonly trelloService = inject(TrelloService);

  /**
   * Router service for accessing route parameters
   */
  readonly route = inject(ActivatedRoute);

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
    this.loadCard();
  }

  /**
   * Loads or refreshes the card data from Trello API
   * @param refresh - Flag indicating if this is a refresh operation
   */
  loadCard(refresh = false): void {
    if (!refresh) {
      if (!this.card) {
        this.route.paramMap.subscribe((params: any) => {
          this.cardId = params.get('id');

          if (this.cardId) {
            this.trelloService.getSingleCard(this.cardId).subscribe({
              next: (card: TrelloCard) => {
                this.card = { ...card };
                this.trelloService.getSingleBoard(card.idBoard).subscribe({
                  next: (board) => {
                    this.stateService.setSelectedBoard({ ...board });
                    this.isLoading.set(false);
                  },
                  error: () => {
                    this.isLoading.set(false);
                    this.toastr.error('Error loading card');
                  },
                });
              },
              error: () => {
                this.isLoading.set(false);
                this.toastr.error('Error loading card');
                this.router.navigate(['/' + ROUTES.DASHBOARD]);
              },
            });
          }
        });
      } else {
        this.isLoading.set(false);
      }
    } else {
      this.isLoading.set(true);
      this.trelloService.getSingleCard(this.cardId ?? '').subscribe({
        next: (card: TrelloCard) => {
          this.card = { ...card };
          this.trelloService.getSingleBoard(card.idBoard).subscribe({
            next: (board) => {
              this.stateService.setSelectedBoard({ ...board });
              this.isLoading.set(false);
            },
            error: () => {
              this.isLoading.set(false);
              this.toastr.error('Error loading card');
            },
          });
        },
        error: () => {
          this.isLoading.set(false);
          this.toastr.error('Error loading card');
          this.router.navigate(['/' + ROUTES.TRELLO_BOARD, this.card?.idBoard]);
        },
      });
    }
  }

  /**
   * Navigates to the board view
   */
  goToBoard(): void {
    this.router.navigate(['/' + ROUTES.TRELLO_BOARD, this.card?.idBoard]);
  }

  /**
   * Navigates to the board view
   */
  goToCard(): void {
    this.router.navigate(['/' + ROUTES.TRELLO_CARD, this.card?.id]);
  }

  /**
   * Opens the card edit form
   */
  openModal(): void {
    this.displayCardForm.set(true);
  }

  /**
   * Closes the card edit form
   */
  closeModal(): void {
    this.displayCardForm.set(false);
  }

  /**
   * Handles card update success
   * Reloads the card data and hides the form
   */
  onCardUpdatedAndClose(): void {
    this.loadCard(true);
    this.closeModal();
  }

  /**
   * Handles Enter or Space on Card
   * @param event - Keyboard event object
   */
  onKeydownCard(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.goToCard();
    }
  }
}
