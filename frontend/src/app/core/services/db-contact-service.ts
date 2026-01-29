/**
 * Service for accessing contact data from Firestore.
 *
 * @method getAllContacts
 *   Retrieves all contacts from the 'contacts' collection in Firestore.
 *   - Returns a Promise that resolves to an array of Contact objects.
 *   - Each contact includes its Firestore document ID and data.
 */

import { Injectable, inject } from '@angular/core';
import { Firestore, collection, getDocs } from '@angular/fire/firestore';
import { Contact } from '../interfaces/db-contact-interface';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private firestore = inject(Firestore);

  async getAllContacts(): Promise<Contact[]> {
    const contactsRef = collection(this.firestore, 'contacts');
    const snapshot = await getDocs(contactsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data() as Contact
    }));
  }
}