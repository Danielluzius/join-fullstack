import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

/**
 * Modal wrapper component for contact forms.
 * Handles modal visibility, escape key closing, and overlay click behavior.
 */
@Component({
  selector: 'app-contact-form-modal',
  imports: [],
  templateUrl: './contact-form-modal.html',
  styleUrl: './contact-form-modal.scss',
  standalone: true,
})
export class ContactFormModal {
  /** Controls visibility of the modal */
  @Input() showModal = false;

  /** Determines if the modal is in edit mode (true) or create mode (false) */
  @Input() editMode = false;

  /** Emits when the modal should be closed */
  @Output() closeModal = new EventEmitter<void>();

  /**
   * Handles the Escape key press to close the modal.
   * Only triggers if the modal is currently visible.
   */
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showModal) {
      this.onClose();
    }
  }

  /**
   * Emits event to close the modal.
   */
  onClose() {
    this.closeModal.emit();
  }

  /**
   * Handles clicks on the modal overlay to close it.
   * 
   * @param event - The mouse event from the overlay click
   */
  onOverlayClick(event: MouseEvent) {
    this.onClose();
  }

  /**
   * Prevents click propagation on the modal content.
   * Ensures clicking inside the modal doesn't close it.
   * 
   * @param event - The mouse event to stop propagation on
   */
  onModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
}