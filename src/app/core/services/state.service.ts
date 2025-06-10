/**
 * @class StateService
 * @description Service that manages application state and user metrics
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  CardMetrics,
  ListMetrics,
  UserMetrics,
} from '../../shared/interfaces/metrics';
import TrelloBoard from '../../shared/interfaces/trello-board';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Service that manages application state and persists user data
 * Handles both in-memory and localStorage state management
 */
@Injectable({
  providedIn: 'root',
})
export class StateService {
  /**
   * Current selected board
   */
  selectedBoard: TrelloBoard | null = null;

  /**
   * User's full name Subject
   */

  private readonly fullNameSubject = new BehaviorSubject<string | null>(null);

  /**
   * User's full name Obbservable
   */

  private readonly fullName$ = this.fullNameSubject.asObservable();

  /**
   * User's metrics data including board and list information
   */
  userMetrics: UserMetrics = { boards: [] };

  /**
   * Constructor that initializes state service
   * Loads user's full name from localStorage if available
   * @param platformId - Platform ID for browser detection
   */
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      const name = localStorage.getItem('fullName');
      this.fullNameSubject.next(name);
    }
  }

  /**
   * Sets the current board
   * @param id - data of the selected board
   */
  setSelectedBoard(board: TrelloBoard | null): void {
    this.selectedBoard = board;
  }

  /**
   * Gets the current board
   * @returns Current board
   */
  getSelectedBoard(): TrelloBoard | null {
    return this.selectedBoard;
  }

  /**
   * Sets the user's full name
   * Persists the name to localStorage on browser platform
   * @param name - User's full name
   */
  setFullName(name: string): void {
    this.fullNameSubject.next(name);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('fullName', name);
    }
  }

  /**
   * Gets the user's full name
   * @returns User's full name
   */
  getFullName(): Observable<string | null> {
    return this.fullName$;
  }

  /**
   * Adds metrics data for a board's list
   * @param boardId - ID of the board
   * @param listId - ID of the list
   * @param listName - Name of the list
   * @param cards - Array of card metrics for the list
   */
  addBoardMetrics(
    boardId: string,
    listId: string,
    listName: string,
    cards: CardMetrics[]
  ) {
    const board = this.userMetrics.boards.find((b) => b.id === boardId);
    if (board) {
      const list = board.lists.find(
        (listMetrics: ListMetrics) => listMetrics.id === listId
      );
      if (list) {
        list.cards = [...cards];
      } else {
        board.lists.push({
          id: listId,
          name: listName,
          cards: [...cards],
        });
      }
    } else {
      this.userMetrics.boards.push({
        id: boardId,
        lists: [
          {
            id: listId,
            name: listName,
            cards: [...cards],
          },
        ],
      });
    }
  }

  getBoardMetrics(boardId: string): ListMetrics[] {
    const board = this.userMetrics.boards.find((b) => b.id === boardId);
    if (board) {
      return board.lists.sort((a, b) => a.id.localeCompare(b.id));
    } else {
      return [];
    }
  }
}
