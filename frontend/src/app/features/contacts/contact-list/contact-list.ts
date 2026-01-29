import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Contact } from '../../../core/interfaces/db-contact-interface';

@Component({
  selector: 'app-contact-list',
  imports: [],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
  standalone: true,
})
export class ContactList implements OnChanges {
  /** Array of contacts to display */
  @Input() contacts: Contact[] = [];

  /** Currently selected contact for highlighting */
  @Input() selectedContact: Contact | null = null;

  /** Emits when a contact is selected */
  @Output() contactSelected = new EventEmitter<Contact>();
  /** Emits when the add contact button is clicked */
  @Output() addContactClicked = new EventEmitter<void>();

  /** Contacts grouped by first letter of firstname */
  groupedContacts: { letter: string; contacts: Contact[] }[] = [];

  /**
   * Lifecycle hook that runs when input properties change.
   * Sorts and groups contacts alphabetically.
   */
  ngOnChanges() {
    this.sortContactsAlphabetically();
    this.groupedContacts = this.groupContactsByLetter();
  }

  /**
   * Sorts the contacts array alphabetically by firstname.
   */
  sortContactsAlphabetically(): void {
    this.contacts.sort((a, b) => a.firstname.localeCompare(b.firstname));
  }

  /**
   * Groups contacts by the first letter of their firstname.
   * 
   * @returns Array of objects containing letter and associated contacts
   */
  groupContactsByLetter(): { letter: string; contacts: Contact[] }[] {
    const groups = this.createContactGroups();
    return this.convertGroupsToArray(groups);
  }

  /**
   * Creates a map of contacts grouped by first letter.
   * 
   * @returns Object with letters as keys and contact arrays as values
   */
  private createContactGroups(): { [key: string]: Contact[] } {
    const groups: { [key: string]: Contact[] } = {};

    this.contacts.forEach((contact) => {
      const letter = contact.firstname.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    });

    return groups;
  }

  /**
   * Converts the contact groups map to a sorted array.
   * 
   * @param groups - Object with letters as keys and contact arrays as values
   * @returns Sorted array of letter-contact pairs
   */
  private convertGroupsToArray(groups: {
    [key: string]: Contact[];
  }): { letter: string; contacts: Contact[] }[] {
    return Object.keys(groups)
      .sort()
      .map((letter) => ({
        letter,
        contacts: groups[letter],
      }));
  }

  /**
   * Emits the selected contact.
   * 
   * @param contact - The contact that was selected
   */
  selectContact(contact: Contact) {
    this.contactSelected.emit(contact);
  }

  /**
   * Emits an event to open the add contact modal.
   */
  openAddModal() {
    this.addContactClicked.emit();
  }

  /**
   * Generates initials from a contact's firstname.
   * Returns first letter for single names, or first and last initial for multiple names.
   * 
   * @param contact - The contact to generate initials for
   * @returns Uppercase initials (1-2 characters)
   */
  getInitials(contact: Contact): string {
    if (!contact || !contact.firstname) return '';

    const nameParts = contact.firstname.trim().split(' ');

    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }

    return this.getFirstAndLastInitial(nameParts);
  }

  /**
   * Extracts first and last initials from name parts.
   * 
   * @param nameParts - Array of name parts
   * @returns Uppercase first and last initials
   */
  private getFirstAndLastInitial(nameParts: string[]): string {
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
