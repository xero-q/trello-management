import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormCardComponent } from './form-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TrelloService } from '../../services/trello.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';

describe('FormCardComponent Integration', () => {
  let component: FormCardComponent;
  let fixture: ComponentFixture<FormCardComponent>;
  let trelloServiceSpy: jasmine.SpyObj<TrelloService>;
  let toastrSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const trelloSpy = jasmine.createSpyObj('TrelloService', [
      'addNewCard',
      'updateCard',
    ]);
    const toastrMock = jasmine.createSpyObj('ToastrService', [
      'error',
      'success',
    ]);

    await TestBed.configureTestingModule({
      imports: [FormCardComponent, ReactiveFormsModule],
      providers: [
        { provide: TrelloService, useValue: trelloSpy },
        { provide: ToastrService, useValue: toastrMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCardComponent);
    component = fixture.componentInstance;
    trelloServiceSpy = TestBed.inject(
      TrelloService
    ) as jasmine.SpyObj<TrelloService>;
    toastrSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  it('should create and initialize form in add mode', () => {
    fixture.componentRef.setInput('idList', 'list-123');
    component.card = null; // add mode
    fixture.detectChanges();

    expect(component.cardForm).toBeTruthy();
    expect(component.cardForm.get('name')?.value).toBe('');
    expect(component.cardForm.get('desc')?.value).toBe('');
  });

  it('should create and initialize form in update mode', () => {
    component.card = {
      id: 'card-1',
      name: 'My Card',
      desc: 'Desc',
      closed: false,
      idBoard: 'board-1',
      idList: 'list-1',
    };
    fixture.detectChanges();

    expect(component.cardForm).toBeTruthy();
    expect(component.cardForm.get('name')?.value).toBe('My Card');
    expect(component.cardForm.get('desc')?.value).toBe('Desc');
  });

  it('should call addNewCard and emit event on valid form submit in add mode', fakeAsync(() => {
    fixture.componentRef.setInput('idList', 'id-1');
    component.card = null;
    fixture.detectChanges();

    component.cardForm.controls['name'].setValue('New Card');
    component.cardForm.controls['desc'].setValue('New Description');
    trelloServiceSpy.addNewCard.and.returnValue(
      of({
        id: 'card-2',
        closed: false,
        idBoard: 'board-2',
        idList: 'list-2',
        name: 'Trello Card',
        desc: 'Card Desc',
      })
    );
    spyOn(component.cardAddedUpdated, 'emit');

    component.onSubmit();
    tick();

    expect(trelloServiceSpy.addNewCard).toHaveBeenCalledWith(
      'New Card',
      'New Description',
      'id-1'
    );
    expect(component.cardAddedUpdated.emit).toHaveBeenCalled();
    expect(component.cardForm.value.name).toBeNull();
  }));

  it('should call updateCard and emit event on valid form submit in update mode', fakeAsync(() => {
    component.card = {
      id: 'card-1',
      name: 'Old Name',
      desc: 'Old Desc',
      closed: false,
      idBoard: 'board-1',
      idList: 'list-1',
    };
    fixture.detectChanges();

    component.cardForm.controls['name'].setValue('Updated Name');
    component.cardForm.controls['desc'].setValue('Updated Desc');
    trelloServiceSpy.updateCard.and.returnValue(
      of({
        id: 'card-1',
        closed: false,
        idBoard: 'board-1',
        idList: 'list-1',
        name: 'Trello Card',
        desc: 'Card Desc',
      })
    );
    spyOn(component.cardAddedUpdated, 'emit');

    component.onSubmit();
    tick();

    expect(trelloServiceSpy.updateCard).toHaveBeenCalledWith(
      'card-1',
      'Updated Name',
      'Updated Desc'
    );
    expect(component.cardAddedUpdated.emit).toHaveBeenCalled();
    expect(component.cardForm.value.name).toBeNull();
  }));

  it('should show error toast if addNewCard fails', fakeAsync(() => {
    fixture.componentRef.setInput('idList', 'list-123');
    component.card = null;
    fixture.detectChanges();

    component.cardForm.controls['name'].setValue('New Card');
    trelloServiceSpy.addNewCard.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.onSubmit();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error while creating card');
  }));

  it('should show error toast if updateCard fails', fakeAsync(() => {
    component.card = {
      id: 'card-1',
      name: 'Old Name',
      desc: 'Old Desc',
      closed: false,
      idBoard: 'board-1',
      idList: 'list-1',
    };
    fixture.detectChanges();

    component.cardForm.controls['name'].setValue('Updated Name');
    component.cardForm.controls['desc'].setValue('Updated Desc');
    trelloServiceSpy.updateCard.and.returnValue(
      throwError(() => new Error('fail'))
    );

    component.onSubmit();
    tick();

    expect(toastrSpy.error).toHaveBeenCalledWith('Error while updating card');
  }));

  it('should mark form as touched when form invalid on submit', () => {
    component.card = null;
    fixture.detectChanges();

    spyOn(component.cardForm, 'markAllAsTouched');
    component.cardForm.controls['name'].setValue(''); // invalid (required)
    component.onSubmit();

    expect(component.cardForm.markAllAsTouched).toHaveBeenCalled();
  });
});
