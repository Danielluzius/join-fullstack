import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Contact } from '../../../../core/interfaces/db-contact-interface';

/**
 * Contact form inputs component with validation.
 * Implements ControlValueAccessor for Angular forms integration.
 * Handles input validation for name, email, and phone fields.
 */
@Component({
  selector: 'app-contact-form-inputs',
  imports: [FormsModule],
  templateUrl: './contact-form-inputs.html',
  styleUrl: './contact-form-inputs.scss',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ContactFormInputs),
      multi: true,
    },
  ],
})
export class ContactFormInputs implements ControlValueAccessor {
  /** Current form data */
  formData: Partial<Contact> = {};

  /** Error message for name field */
  nameError = '';

  /** Error message for email field */
  emailError = '';

  /** Error message for phone field */
  phoneError = '';


  /** Callback function for value changes */
  private onChange: (value: Partial<Contact>) => void = () => {};

  /** Callback function for touch events */
  private onTouched: () => void = () => {};

  /**
   * Writes a new value to the form.
   * Part of ControlValueAccessor interface.
   * 
   * @param value - The contact data to populate the form with
   */
  writeValue(value: Partial<Contact>): void {
    if (value) {
      this.formData = { ...value };
    } else {
      this.formData = {};
      this.clearAllErrors();
    }
  }

  /**
   * Registers the onChange callback.
   * Part of ControlValueAccessor interface.
   * 
   * @param fn - Callback function to execute on value changes
   */
  registerOnChange(fn: (value: Partial<Contact>) => void): void {
    this.onChange = fn;
  }

  /**
   * Registers the onTouched callback.
   * Part of ControlValueAccessor interface.
   * 
   * @param fn - Callback function to execute on touch events
   */
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  /**
   * Clears all validation error messages.
   */
  clearAllErrors() {
    this.nameError = '';
    this.emailError = '';
    this.phoneError = '';
  }

  /**
   * Updates form data and triggers callbacks.
   * Notifies parent components of changes.
   */
  updateFormData() {
    this.onChange(this.formData);
    this.onTouched();
  }

  /**
   * Handles name input changes and validates the field.
   * Sets error message if name is empty.
   */
  onNameInput() {
    if (this.formData.firstname && this.formData.firstname.trim()) {
      this.nameError = '';
    } else {
      this.nameError = 'Name is required';
    }
    this.updateFormData();
  }

  /**
   * Validates an email address format.
   * 
   * @param email - The email address to validate
   * @returns True if email format is valid, false otherwise
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Handles email input changes and validates the field.
   * Checks for empty value and valid email format.
   */
  onEmailInput() {
    if (!this.formData.email || this.formData.email.trim() === '') {
      this.emailError = 'Email is required';
    } else if (!this.validateEmail(this.formData.email)) {
      this.emailError = 'Please enter a valid email (e.g., user@example.com)';
    } else {
      this.emailError = '';
    }
    this.updateFormData();
  }

  /**
   * Handles phone input changes and sanitizes the value.
   * Allows only numbers, +, spaces, hyphens, and parentheses.
   * 
   * @param event - The input event
   */
  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9+\s\-()]/g, '');
    this.formData.phone = input.value;

    if (!this.formData.phone || this.formData.phone.trim() === '') {
      this.phoneError = 'Phone number is required';
    } else {
      this.phoneError = '';
    }

    this.updateFormData();
  }

  /**
   * Validates all form fields.
   * 
   * @returns True if all fields are valid, false otherwise
   */
  validateAll(): boolean {
    let isValid = true;

    if (!this.formData.firstname || !this.formData.firstname.trim()) {
      this.nameError = 'Name is required';
      isValid = false;
    }

    if (!this.validateEmailField()) {
      isValid = false;
    }

    if (!this.formData.phone || !this.formData.phone.trim()) {
      this.phoneError = 'Phone number is required';
      isValid = false;
    }

    return isValid;
  }

  /**
   * Validates the email field and sets appropriate error message.
   * 
   * @returns True if email is valid, false otherwise
   */
  private validateEmailField(): boolean {
    if (!this.formData.email || !this.formData.email.trim()) {
      this.emailError = 'Email is required';
      return false;
    } else if (!this.validateEmail(this.formData.email)) {
      this.emailError = 'Please enter a valid email (e.g., user@example.com)';
      return false;
    }
    return true;
  }
}
