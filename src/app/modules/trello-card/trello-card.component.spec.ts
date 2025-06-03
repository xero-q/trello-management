import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloCardComponent } from './trello-card.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

describe('TrelloCardComponent', () => {
  let component: TrelloCardComponent;
  let fixture: ComponentFixture<TrelloCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrelloCardComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideToastr({
          timeOut: 3000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrelloCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
