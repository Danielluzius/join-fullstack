import { Component, Input, Output, EventEmitter, OnChanges, ViewChild } from '@angular/core';
import { Contact } from '../../../core/interfaces/db-contact-interface';
import { ContactAvatar } from './contact-avatar/contact-avatar';
import { ContactFormInputs } from './contact-form-inputs/contact-form-inputs';
import { ContactFormModal } from './contact-form-modal/contact-form-modal';
import { FormsModule } from '@angular/forms';

/**
 * Contact form component for creating and editing contacts.
 * Manages form state, validation, and submission for contact operations.
 */
@Component({
  selector: 'app-contact-form',
  imports: [ContactAvatar, ContactFormInputs, ContactFormModal, FormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss',
  standalone: true,
})
export class ContactForm implements OnChanges {
  /** Controls visibility of the modal */
  @Input() showModal = false;
  /** Determines if the form is in edit mode (true) or create mode (false) */
  @Input() editMode = false;
  /** Contact data to populate the form in edit mode */
  @Input() contact: Partial<Contact> | null = null;
  /** Error message to display in the form */
  @Input() errorMessage = '';

  /** Emits when the modal should be closed */
  @Output() closeModal = new EventEmitter<void>();
  /** Emits when a new contact should be created */
  @Output() createContact = new EventEmitter<Partial<Contact>>();
  /** Emits when an existing contact should be saved */
  @Output() saveContact = new EventEmitter<Partial<Contact>>();
  /** Emits when delete is requested from edit mode */
  @Output() deleteFromEdit = new EventEmitter<void>();

  /** Reference to the form inputs child component for validation */
  @ViewChild(ContactFormInputs) contactFormInputs!: ContactFormInputs;

  /** Current form data */
  formData: Partial<Contact> = {};

  /**
   * Lifecycle hook that runs when input properties change.
   * Populates form data with contact information in edit mode.
   */
  ngOnChanges() {
    if (this.contact) {
      this.formData = { ...this.contact };
    } else {
      this.formData = {};
    }
  }

  /**
   * Emits event to close the modal.
   */
  onClose() {
    this.closeModal.emit();
  }

  /**
   * Validates and submits the form.
   * Creates a new contact in create mode, saves changes in edit mode.
   */
  onSubmit() {
    if (this.contactFormInputs && !this.contactFormInputs.validateAll()) {
      return; 
    }
    if (this.editMode) {
      this.saveContact.emit(this.formData);
    } else {
      this.createContact.emit(this.formData);
    }
  }

  /**
   * Emits event to delete the contact from edit mode.
   */
  onDeleteFromEdit() {
    this.deleteFromEdit.emit();
  }

  /**
   * Updates the form data with new values.
   * 
   * @param data - Partial contact data to update
   */
  updateFormData(data: Partial<Contact>) {
    this.formData = data;
  }
}
