import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Contact } from '../../../core/interfaces/db-contact-interface';

/**
 * Contact details component that displays full contact information.
 * Handles edit, delete, and back navigation actions with mobile overlay support.
 */
@Component({
  selector: 'app-contact-details',
  imports: [],
  templateUrl: './contact-details.html',
  styleUrl: './contact-details.scss',
  standalone: true,
})
export class ContactDetails {
  /** Currently selected contact to display */
  @Input() selectedContact: Contact | null = null;

  /** Emits when the edit button is clicked */
  @Output() editClicked = new EventEmitter<Contact>();

  /** Emits when the delete button is clicked */
  @Output() deleteClicked = new EventEmitter<void>();

  /** Emits when the back button is clicked (mobile only) */
  @Output() backClicked = new EventEmitter<void>();

  /** Controls visibility of mobile options overlay */
  showMobileOptionsOverlay = false;

  /**
   * Handles window resize events.
   * Hides mobile options overlay when window width exceeds 600px.
   * 
   * @param event - The resize event
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (window.innerWidth > 600) {
      this.showMobileOptionsOverlay = false;
    }
  }

  /**
   * Toggles the visibility of the mobile options overlay.
   */
  toggleMobileOptions() {
    this.showMobileOptionsOverlay = !this.showMobileOptionsOverlay;
  }

  /**
   * Handles edit button click.
   * Hides mobile overlay and emits the selected contact for editing.
   */
  onEdit() {
    this.showMobileOptionsOverlay = false;
    if (this.selectedContact) {
      this.editClicked.emit(this.selectedContact);
    }
  }

  /**
   * Handles delete button click.
   * Hides mobile overlay and emits delete event.
   */
  onDelete() {
    this.showMobileOptionsOverlay = false;
    this.deleteClicked.emit();
  }

  /**
   * Handles back button click (mobile navigation).
   * Emits back event to return to contact list.
   */
  onBack() {
    this.backClicked.emit();
  }

  /**
   * Generates initials from a contact's firstname.
   * Returns first letter for single names, or first and last initial for multiple names.
   * 
   * @param contact - The contact to generate initials for
   * @returns Uppercase initials (1-2 characters), or empty string if no firstname
   */
  getInitials(contact: Contact): string {
    if (!contact || !contact.firstname) return '';
    
    const nameParts = contact.firstname.trim().split(' ');
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  }

  /** Color palette for contact avatars */
  colorPalette = [
    '#FF7A00',
    '#9327FF',
    '#6E52FF',
    '#FC71FF',
    '#FFBB2B',
    '#1FD7C1',
    '#462F8A',
    '#FF4646',
    '#00BEE8',
    '#FF5EB3',
    '#FF745E',
    '#FFA35E',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
  ];

  /**
   * Generates a consistent avatar color for a contact based on their ID.
   * Uses a hash function to map the ID to a color from the palette.
   * 
   * @param contact - The contact to generate a color for
   * @returns Hex color code from the color palette
   */
  getAvatarColor(contact: Contact): string {
    let hash = 0;
    const idString = String(contact.id);

    for (let i = 0; i < idString.length; i++) {
      hash = idString.charCodeAt(i) + ((hash << 5) - hash);
    }

    const index = Math.abs(hash) % this.colorPalette.length;
    return this.colorPalette[index];
  }
}
