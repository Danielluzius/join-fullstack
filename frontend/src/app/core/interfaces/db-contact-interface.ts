/**
 * Represents a contact entry.
 *
 * @property id - (Optional) Unique identifier for the contact.
 * @property email - The contact's email address.
 * @property firstname - The contact's first name.
 * @property lastname - (Optional) The contact's last name.
 * @property phone - The contact's phone number.
 */

export interface Contact {
  id?: string;
  email: string;
  firstname: string;
  lastname?: string;
  phone: string;
}

/**
 * Helper class for Contact-related utility functions.
 *
 * - getPhone: Returns the phone number of the contact.
 * - getEmail: Returns the email address of the contact.
 * - getFirstname: Returns the first name of the contact.
 * - getFullName: Returns the full name (first and last name) of the contact.
 * - getAllData: Returns the entire contact object.
 */
export class ContactHelper {
  static getPhone(contact: Contact): string {
    return contact.phone;
  }

  static getEmail(contact: Contact): string {
    return contact.email;
  }

  static getFirstname(contact: Contact): string {
    return contact.firstname;
  }

  static getFullName(contact: Contact): string {
    return `${contact.firstname} ${contact.lastname}`;
  }

  static getAllData(contact: Contact): Contact {
    return contact;
  }
}