/**
 * @class TrelloBoardComponent
 * @description Component that represents a Trello board and manages its lists and cards
 */
import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { TrelloListComponent } from '../trello-list/trello-list.component';
import { ToastrService } from 'ngx-toastr';
import { NgIf } from '@angular/common';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { ModalComponent } from '../../core/components/modal/modal.component';
import TrelloList from '../../shared/interfaces/trello-list';
import { TrelloService } from '../../core/services/trello.service';
import { StateService } from '../../core/services/state.service';
import { GeminiService } from '../../core/services/gemini.service';
import { ListMetrics } from '../../shared/interfaces/metrics';
import ROUTES from '../../shared/constants/routes';

/**
 * Component that represents a Trello board and manages its lists and cards
 * Integrates with Gemini AI for board recommendations
 */
@Component({
  selector: 'app-trello-board',
  imports: [
    MarkdownModule,
    TrelloListComponent,
    LoaderComponent,
    ModalComponent,
    NgIf,
  ],
  templateUrl: './trello-board.component.html',
  styleUrl: './trello-board.component.scss',
})
export class TrelloBoardComponent implements OnInit {
  /**
   * Current board ID
   */
  boardId: string | null = null;

  /**
   * Loading state indicator
   */
  isLoading = signal(false);

  /**
   * AI-generated board recommendation text
   */
  boardRecommendation: string | null = null;

  /**
   * Flag to control display of Gemini AI response
   */
  displayGeminiResponse = signal(false);

  /**
   * Signal that holds the list of tasks/lists
   */
  tasksLists: WritableSignal<TrelloList[]> = signal([]);

  /**
   * Flag indicating if AI is currently processing a request
   */
  isPromptingAI = signal(false);

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
   * Gemini AI service
   */
  readonly geminiService = inject(GeminiService);

  /**
   * Retrieves board metrics from state service
   * @returns Array of list metrics for the current board
   */
  getBoardMetrics(): ListMetrics[] {
    return this.stateService.getBoardMetrics(this.boardId ?? '');
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: any) => {
      this.boardId = params.get('id');

      if (this.boardId) {
        this.isLoading.set(true);

        this.trelloService.getSingleBoard(this.boardId).subscribe({
          next: (board) => {
            this.stateService.setSelectedBoard({ ...board });
            this.trelloService
              .getLists(board.id)
              .pipe(
                map((lists: TrelloList[]) =>
                  lists.filter((list) => !list.closed)
                )
              )
              .subscribe({
                next: (lists: TrelloList[]) => {
                  this.tasksLists.set(lists);
                  this.isLoading.set(false);
                },
                error: () => {
                  this.toastr.error('Error loading board');
                  this.isLoading.set(false);
                  this.router.navigate(['/' + ROUTES.DASHBOARD]);
                },
              });
          },
          error: () => {
            this.toastr.error('Error loading board');
            this.isLoading.set(false);
            this.router.navigate(['/' + ROUTES.DASHBOARD]);
          },
        });
      }
    });
  }

  /**
   * Get recommendation from Gemini AI based on the provided prompt
   * @param prompt Prompt to send to Gemini AI for generating a recommendation
   */
  getBoardRecommendation(prompt: string) {
    this.isPromptingAI.set(true);
    this.geminiService.sendPrompt(prompt).subscribe({
      next: (response: any) => {
        this.boardRecommendation = response.candidates[0].content.parts[0].text;
        this.isPromptingAI.set(false);
        this.openModal();
      },
      error: () => {
        this.toastr.warning('Error when prompting Gemini API');
        this.isPromptingAI.set(false);
      },
    });
  }

  /**
   * Handles click on the "Ask AI recommendation" button
   * It retrieves board metrics and sends a prompt to Gemini AI for recommendations
   */
  doAskBoardRecommendation() {
    const boardMetrics = this.stateService.getBoardMetrics(this.boardId ?? '');
    const prompt = `Here it is a JSON stringified of my lists and theirs cards of a Trello board: ${JSON.stringify(
      boardMetrics,
      null,
      2
    )}. Based on that, I want you to suggest me some changes on the work flow and which should be the prioritized cards. Just include in your response the suggestions, no other text.`;
    this.getBoardRecommendation(prompt);
  }

  /**
   * Open modal
   */
  openModal() {
    this.displayGeminiResponse.set(true);
  }

  /**
   * Close modal
   */
  closeModal() {
    this.displayGeminiResponse.set(false);
  }
}
