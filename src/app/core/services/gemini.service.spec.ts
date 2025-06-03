import { TestBed } from '@angular/core/testing';

import { GeminiService } from './gemini.service';
import { provideHttpClient } from '@angular/common/http';

describe('GeminiService', () => {
  let service: GeminiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(GeminiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
