import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormBoardComponent } from './form-board.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TrelloService } from '../../services/trello.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';

describe('FormBoardComponent', () => {
  let component: FormBoardComponent;
  let fixture: ComponentFixture<FormBoardComponent>;
  let trelloServiceSpy: jasmine.SpyObj<TrelloService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const trelloSpy = jasmine.createSpyObj('TrelloService', ['addNewBoard']);
    const toastSpy = jasmine.createSpyObj('ToastrService', [
      'error',
      'success',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormBoardComponent],
      providers: [
        provideHttpClient(),
        { provide: TrelloService, useValue: trelloSpy },
        { provide: ToastrService, useValue: toastSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormBoardComponent);
    component = fixture.componentInstance;
    trelloServiceSpy = TestBed.inject(
      TrelloService
    ) as jasmine.SpyObj<TrelloService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    fixture.detectChanges();
  });

  it('should call addNewBoard and emit boardAdded on valid form submit', fakeAsync(() => {
    // Arrange
    component.boardForm.controls['name'].setValue('New Board');
    trelloServiceSpy.addNewBoard.and.returnValue(
      of({ id: '1', name: 'New Board', closed: false, url: '' })
    );

    spyOn(component.boardAdded, 'emit');

    // Act
    component.onSubmit();
    tick();

    // Assert
    expect(trelloServiceSpy.addNewBoard).toHaveBeenCalledWith('New Board');
    expect(component.boardAdded.emit).toHaveBeenCalled();
    expect(component.boardForm.value.name).toBeNull(); // form reset clears value
  }));

  it('should show toastr error on service failure', fakeAsync(() => {
    // Arrange
    component.boardForm.controls['name'].setValue('Fail Board');
    trelloServiceSpy.addNewBoard.and.returnValue(
      throwError(() => new Error('Failed'))
    );

    // Act
    component.onSubmit();
    tick();

    // Assert
    expect(toastrSpy.error).toHaveBeenCalledWith('Error while creating board');
  }));
});
