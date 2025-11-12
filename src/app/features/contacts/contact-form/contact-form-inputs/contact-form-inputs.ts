import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Contact } from '../../../../core/interfaces/db-contact-interface';

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
  formData: Partial<Contact> = {};
  nameError = '';
  emailError = '';
  phoneError = '';

  private onChange: (value: Partial<Contact>) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: Partial<Contact>): void {
    if (value) {
      this.formData = { ...value };
    } else {
      this.formData = {};
      this.clearAllErrors();
    }
  }

  registerOnChange(fn: (value: Partial<Contact>) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  clearAllErrors() {
    this.nameError = '';
    this.emailError = '';
    this.phoneError = '';
  }

  updateFormData() {
    this.onChange(this.formData);
    this.onTouched();
  }

  onNameInput() {
    if (this.formData.firstname && this.formData.firstname.trim()) {
      this.nameError = '';
    } else {
      this.nameError = 'Name is required';
    }
    this.updateFormData();
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

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
