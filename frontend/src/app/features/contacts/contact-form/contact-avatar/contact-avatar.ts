import { Component, Input } from '@angular/core';
import { Contact } from '../../../../core/interfaces/db-contact-interface';

/**
 * Contact avatar component that displays user initials with colored background.
 * Generates initials from contact name and assigns consistent colors.
 */
@Component({
  selector: 'app-contact-avatar',
  imports: [],
  templateUrl: './contact-avatar.html',
  styleUrl: './contact-avatar.scss',
  standalone: true,
})
export class ContactAvatar {
  /** Contact data to display avatar for */
  @Input() contact: Partial<Contact> | null = null;

  /** Determines if the avatar is displayed in edit mode */
  @Input() editMode = false;

  /**
   * Generates initials from a contact's firstname.
   * Returns first letter for single names, or first and last initial for multiple names.
   * 
   * @param contact - The contact to generate initials for
   * @returns Uppercase initials (1-2 characters), or empty string if no firstname
   */
  getInitials(contact: Partial<Contact>): string {
    if (!contact || !contact.firstname) return '';
    
    const nameParts = contact.firstname.trim().split(' ');
    
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    const firstInitial = nameParts[0].charAt(0);
    const lastInitial = nameParts[nameParts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  }

  /**
   * Generates a consistent avatar background color based on contact name.
   * Uses character code sum to map name to a color from the palette.
   * 
   * @param contact - The contact to generate a color for
   * @returns Hex color code from the color palette, or default color if contact is null
   */
  getAvatarColor(contact: Partial<Contact> | null): string {
    if (!contact) return '#FF6B6B';
    const colors = [
      '#FF6B6B',
      '#4ECDC4',
      '#45B7D1',
      '#FFA07A',
      '#98D8C8',
      '#F7DC6F',
      '#BB8FCE',
      '#85C1E2',
    ];
    const name = (contact.firstname || '') + (contact.lastname || '');
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
  }
}
