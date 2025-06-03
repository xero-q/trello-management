import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloAccountComponent } from './trello-account.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

describe('TrelloAccountComponent', () => {
  let component: TrelloAccountComponent;
  let fixture: ComponentFixture<TrelloAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrelloAccountComponent],
      providers: [
        provideHttpClient(),
        provideToastr({
          timeOut: 3000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrelloAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
