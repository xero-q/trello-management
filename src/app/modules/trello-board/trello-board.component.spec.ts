import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloBoardComponent } from './trello-board.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideToastr } from 'ngx-toastr';

describe('TrelloBoardComponent', () => {
  let component: TrelloBoardComponent;
  let fixture: ComponentFixture<TrelloBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrelloBoardComponent],
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

    fixture = TestBed.createComponent(TrelloBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
