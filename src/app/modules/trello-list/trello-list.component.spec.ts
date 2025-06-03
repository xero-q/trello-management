import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrelloListComponent } from './trello-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr } from 'ngx-toastr';

describe('TrelloListComponent', () => {
  let component: TrelloListComponent;
  let fixture: ComponentFixture<TrelloListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrelloListComponent],
      providers: [
        provideHttpClient(),
        provideToastr({
          timeOut: 3000,
          positionClass: 'toast-top-right',
          preventDuplicates: true,
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TrelloListComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('list', {
      id: '1',
      name: 'Test List',
      idBoard: '2',
      closed: false,
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
