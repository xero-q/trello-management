import { TestBed } from '@angular/core/testing';

import { TrelloService } from './trello.service';
import { provideHttpClient } from '@angular/common/http';

describe('TrelloService', () => {
  let service: TrelloService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });
    service = TestBed.inject(TrelloService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
