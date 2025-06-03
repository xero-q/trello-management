/**
 * @class GeminiService
 * @description Service that handles interactions with Google's Gemini AI API
 */
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

/**
 * Service that provides integration with Google's Gemini AI API
 * Handles prompt generation and response processing
 */
@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  /**
   * Gemini API key from environment configuration
   */
  GEMINI_API_KEY = environment.GEMINI_API_KEY;

  /**
   * Base URL for Gemini API requests
   */
  API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${this.GEMINI_API_KEY}`;

  /**
   * Constructor that initializes the service with HTTP client
   * @param httpClient - Angular's HTTP client for making API requests
   */
  constructor(private httpClient: HttpClient) {}

  /**
   * Sends a prompt to Gemini AI and returns the response
   * @param prompt - Text prompt to send to Gemini AI
   * @returns Observable containing the AI response
   */
  sendPrompt(prompt: string): Observable<any> {
    return this.httpClient.post<any>(
      this.API_URL,
      {
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
