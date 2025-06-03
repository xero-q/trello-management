/**
 * @class ModalComponent
 * @description Reusable modal dialog component that can be used for various purposes
 */
import { Component, HostListener, output } from '@angular/core';

/**
 * Component that provides a reusable modal dialog
 * Handles closing via button click or escape key
 */
@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  /**
   * Event emitter that triggers when the modal should be closed
   * @event
   */
  closeModal = output<void>();

  /**
   * Closes the modal by emitting the close event
   */
  close() {
    this.closeModal.emit();
  }

  /**
   * Handles the escape key press to close the modal
   * @param event - Keyboard event object
   */
  @HostListener('document:keydown.escape', ['$event'])
  handleEscapeKey() {
    this.close();
  }
}
