import { NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TrelloService } from '../../services/trello.service';
import TrelloCard from '../../../shared/interfaces/trello-card';
import { ToastrService } from 'ngx-toastr';

/**
 * FormCardComponent is responsible for rendering a form to create or update a Trello card.
 * It handles form submission, validation, and communication with the TrelloService.
 */
@Component({
  selector: 'app-form-card',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './form-card.component.html',
  styleUrl: './form-card.component.scss',
})
export class FormCardComponent implements OnInit, AfterViewInit {
  /**
   * The form group instance for the card form.
   */
  public cardForm!: FormGroup;

  /**
   * The ID of the list where the card will be added or updated.
   */
  readonly idList = input<string>();

  /**
   * The card object being updated, or undefined if creating a new card.
   */
  card = input<TrelloCard>();

  /**
   * Emits an event when a card is added or updated.
   */
  readonly cardAddedUpdated = output<void>();

  /**
   * Flag indicating whether the form is currently being submitted.
   */
  protected readonly isSubmitting = signal(false);

  /**
   * Reference to the name input element.
   */
  @ViewChild('nameInput')
  private readonly nameInput!: ElementRef<HTMLInputElement>;

  /**
   * Form builder service for creating reactive forms
   */
  private readonly fb = inject(FormBuilder);

  /**
   * Service for Trello API interactions
   */
  private readonly trelloService = inject(TrelloService);

  /**
   * Toast notification service
   */
  private readonly toastr = inject(ToastrService);

  /**
   * Initializes the form group instance based on whether a card is being updated or created.
   */
  ngOnInit() {
    this.cardForm = !this.card()
      ? this.fb.group({
          name: ['', Validators.required],
          desc: [''],
        })
      : this.fb.group({
          name: [this.card()?.name, Validators.required],
          desc: [this.card()?.desc],
        });
  }

  /**
   * Sets focus on the name input element after the view has been initialized.
   */
  ngAfterViewInit(): void {
    setTimeout(() => this.nameInput.nativeElement.focus(), 0);
  }

  /**
   * Handles form submission, validating the form and calling the Trello service to add or update a card.
   */
  onSubmit() {
    if (this.cardForm.valid) {
      this.isSubmitting.set(true);
      const name = this.cardForm.get('name')?.value.trim();
      const desc = this.cardForm.get('desc')?.value.trim();

      if (!this.card()) {
        // Adding a new card
        this.trelloService
          .addNewCard(name, desc, this.idList() ?? '')
          .subscribe({
            next: () => {
              this.cardAddedUpdated.emit();
              this.cardForm.reset();
              this.isSubmitting.set(false);
              this.toastr.success('Card created successfully');
            },
            error: () => {
              this.isSubmitting.set(false);
              this.toastr.error('Error while creating card');
            },
          });
      } else {
        //Updating
        const name = this.cardForm.get('name')?.value.trim();
        const description = this.cardForm.get('desc')?.value.trim();
        this.trelloService
          .updateCard(this.card()?.id || '', name, description)
          .subscribe({
            next: () => {
              this.cardAddedUpdated.emit();
              this.cardForm.reset();
              this.isSubmitting.set(false);
              this.toastr.success('Card updated successfully');
            },
            error: () => {
              this.toastr.error('Error while updating card');
              this.isSubmitting.set(false);
            },
          });
      }
    } else {
      this.cardForm.markAllAsTouched();
    }
  }
}
