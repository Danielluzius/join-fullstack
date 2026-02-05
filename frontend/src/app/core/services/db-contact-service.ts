/**
 * Service for accessing contact data from Django REST API.
 *
 * @method getAllContacts
 *   Retrieves all contacts from the Django API.
 *   - Returns a Promise that resolves to an array of Contact objects.
 *   - Requires authentication token.
 */

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Contact } from '../interfaces/db-contact-interface';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Django API returns contacts with numeric IDs
 */
interface ContactApiResponse {
  id: number;
  email: string;
  firstname: string;
  lastname?: string;
  phone: string;
  created_at?: string;
  updated_at?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contacts/`;

  /**
   * Retrieves all contacts from the API.
   */
  async getAllContacts(): Promise<Contact[]> {
    try {
      const contacts = await firstValueFrom(this.http.get<ContactApiResponse[]>(this.apiUrl));
      // Convert numeric IDs to strings for consistency
      return contacts.map((contact) => ({
        ...contact,
        id: contact.id.toString(),
      }));
    } catch (error) {
      console.error('Error loading contacts:', error);
      return [];
    }
  }

  /**
   * Creates a new contact.
   */
  async createContact(
    contact: Omit<Contact, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<Contact> {
    const newContact = await firstValueFrom(
      this.http.post<ContactApiResponse>(this.apiUrl, contact),
    );
    // Convert numeric ID to string for consistency
    return {
      ...newContact,
      id: newContact.id.toString(),
    };
  }

  /**
   * Updates an existing contact.
   */
  async updateContact(id: string, contact: Partial<Contact>): Promise<Contact> {
    const updatedContact = await firstValueFrom(
      this.http.put<ContactApiResponse>(`${this.apiUrl}${id}/`, contact),
    );
    // Convert numeric ID to string for consistency
    return {
      ...updatedContact,
      id: updatedContact.id.toString(),
    };
  }

  /**
   * Deletes a contact.
   */
  async deleteContact(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}${id}/`));
  }
}
