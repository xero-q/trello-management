/**
 * @class TrelloService
 * @description Service that handles all Trello API interactions
 * @author Your Name
 */
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import TrelloBoard from '../../shared/interfaces/trello-board';
import TrelloList from '../../shared/interfaces/trello-list';
import TrelloCard from '../../shared/interfaces/trello-card';
import User from '../../shared/interfaces/user';
import { AuthService } from './auth.service';

/**
 * Service that provides methods to interact with Trello API
 * Handles all Trello-related HTTP requests and responses
 */
@Injectable({
  providedIn: 'root',
})
export class TrelloService {
  /**
   * Trello API key from environment configuration
   */
  API_KEY = environment.TRELLO_API_KEY;

  /**
   * Base URL for Trello API endpoints
   */
  baseUrl = 'https://api.trello.com/1';

  /**
   * Constructor that injects required dependencies
   * @param httpClient - Angular's HTTP client for making API requests
   * @param authService - Service for handling authentication
   */
  constructor(
    private httpClient: HttpClient,
    private authService: AuthService
  ) {}

  /**
   * Retrieves current user information from Trello
   * @returns Observable containing user information
   */
  getUserInfo(): Observable<User> {
    const token = this.authService.getToken();
    const url = `${this.baseUrl}/members/me?key=${this.API_KEY}&token=${token}`;
    return this.httpClient.get<User>(url);
  }

  /**
   * Retrieves all boards associated with the current user
   * @returns Observable containing an array of Trello boards
   */
  getBoards(): Observable<TrelloBoard[]> {
    const token = this.authService.getToken();
    return this.httpClient.get<TrelloBoard[]>(
      `${this.baseUrl}/members/me/boards?key=${this.API_KEY}&token=${token}`
    );
  }

  /**
   * Retrieves a single board by its ID
   * @param boarddId - ID of the board to retrieve
   * @returns Observable containing a single Trello board
   */
  getSingleBoard(boardId: string): Observable<TrelloBoard> {
    const token = this.authService.getToken();
    return this.httpClient.get<TrelloBoard>(
      `${this.baseUrl}/boards/${boardId}?key=${this.API_KEY}&token=${token}`
    );
  }

  /**
   * Retrieves all lists within a specific board
   * @param boardId - ID of the board to retrieve lists from
   * @returns Observable containing an array of Trello lists
   */
  getLists(boardId: string): Observable<TrelloList[]> {
    const token = this.authService.getToken();
    return this.httpClient.get<TrelloList[]>(
      `${this.baseUrl}/boards/${boardId}/lists?key=${this.API_KEY}&token=${token}`
    );
  }

  /**
   * Retrieves all cards within a specific list
   * @param listId - ID of the list to retrieve cards from
   * @returns Observable containing an array of Trello cards
   */
  getCards(listId: string): Observable<TrelloCard[]> {
    const token = this.authService.getToken();
    return this.httpClient.get<TrelloCard[]>(
      `${this.baseUrl}/lists/${listId}/cards?key=${this.API_KEY}&token=${token}`
    );
  }

  /**
   * Retrieves a single card by its ID
   * @param cardId - ID of the card to retrieve
   * @returns Observable containing a single Trello card
   */
  getSingleCard(cardId: string): Observable<TrelloCard> {
    const token = this.authService.getToken();
    return this.httpClient.get<TrelloCard>(
      `${this.baseUrl}/cards/${cardId}?key=${this.API_KEY}&token=${token}`
    );
  }

  addNewBoard(boardName: string): Observable<TrelloBoard> {
    const url = `${this.baseUrl}/boards/`;
    const params = new HttpParams()
      .set('name', boardName)
      .set('key', this.API_KEY)
      .set('token', this.authService.getToken() ?? '');

    return this.httpClient.post<TrelloBoard>(url, null, { params });
  }

  addNewCard(
    cardName: string,
    cardDescription: string,
    idList: string
  ): Observable<TrelloCard> {
    const url = `${this.baseUrl}/cards/`;
    const params = new HttpParams()
      .set('name', cardName)
      .set('desc', cardDescription)
      .set('idList', idList)
      .set('key', this.API_KEY)
      .set('token', this.authService.getToken() ?? '');

    return this.httpClient.post<TrelloCard>(url, null, { params });
  }

  updateCard(
    cardId: string,
    cardName: string,
    cardDesc: string
  ): Observable<TrelloCard> {
    const updateFields = {
      name: cardName,
      desc: cardDesc,
    };
    const token = this.authService.getToken();

    const url = `${this.baseUrl}/cards/${cardId}?key=${this.API_KEY}&token=${token}`;

    return this.httpClient.put<TrelloCard>(url, updateFields, {});
  }
}
