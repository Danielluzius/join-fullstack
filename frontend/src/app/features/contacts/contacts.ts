import { Component, OnInit, inject, HostListener } from '@angular/core';
import { ContactService } from '../../core/services/db-contact-service';
import { ContactHelper, Contact } from '../../core/interfaces/db-contact-interface';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ContactList } from './contact-list/contact-list';
import { ContactDetails } from './contact-details/contact-details';
import { ContactForm } from './contact-form/contact-form';

/**
 * Main contacts management component.
 * Handles contact CRUD operations, modal states, and contact selection.
 */
@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
  standalone: true,
  imports: [FormsModule, ContactList, ContactDetails, ContactForm],
})
export class Contacts implements OnInit {
  /** Array of all contacts loaded from the database */
  contacts: Contact[] = [];
  /** Currently selected contact for detail view */
  selectedContact: Contact | null = null;
  /** Controls visibility of the add/edit contact modal */
  showAddModal = false;
  /** Controls visibility of the delete confirmation modal */
  showDeleteModal = false;
  /** Temporary contact object for create/edit operations */
  newContact: Partial<Contact> = {};
  /** Controls visibility of success animation */
  showSuccess = false;
  /** Indicates whether contacts are currently being loaded */
  isLoading = true;

  private contactService = inject(ContactService);
  private firestore = inject(Firestore);

  /** Indicates whether the form is in edit mode (true) or create mode (false) */
  editMode = false;

  /**
   * Lifecycle hook that runs on component initialization.
   * Loads all contacts from the database.
   */
  ngOnInit() {
    this.loadContacts();
  }

  /**
   * Loads all contacts from the database and updates loading state.
   */
  async loadContacts() {
    this.isLoading = true;
    try {
      this.contacts = await this.contactService.getAllContacts();
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Sets the selected contact for detail view.
   * 
   * @param contact - The contact to select
   */
  selectContact(contact: Contact) {
    this.selectedContact = contact;
  }

  /**
   * Clears the currently selected contact.
   */
  deselectContact() {
    this.selectedContact = null;
  }

  /**
   * Opens the add/edit contact modal.
   * If a contact is provided, opens in edit mode; otherwise opens in create mode.
   * 
   * @param editContact - Optional contact to edit. If omitted, opens create form.
   */
  openAddModal(editContact?: Contact) {
    this.showAddModal = true;
    if (editContact) {
      this.editMode = true;
      this.newContact = { ...editContact };
    } else {
      this.editMode = false;
      this.newContact = {};
    }
  }

  /**
   * Closes the add/edit modal and resets form state.
   */
  closeAddModal() {
    this.showAddModal = false;
    this.editMode = false;
    this.newContact = {};
  }

  /**
   * Displays the success animation for 2 seconds.
   */
  showSuccessAnimation() {
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 2000);
  }

  /**
   * Creates a new contact in Firestore and updates local state.
   * 
   * @param contactData - The contact data to create
   */
  async handleCreateContact(contactData: Partial<Contact>) {
    const contactsRef = collection(this.firestore, 'contacts');
    const docRef = await addDoc(contactsRef, contactData);
    const contact: Contact = { id: docRef.id, ...(contactData as Contact) };
    this.contacts.push(contact);
    this.selectedContact = contact;
    await this.reloadContacts();
    this.closeAddModal();
    this.showSuccessAnimation();
  }

  /**
   * Updates an existing contact in Firestore and local state.
   * 
   * @param contactData - The contact data to update (must include id)
   */
  async handleSaveContact(contactData: Partial<Contact>) {
    if (!contactData.id) return;

    await this.updateContactInFirestore(contactData);
    this.updateLocalContact(contactData);
    await this.reloadContacts();
    this.closeAddModal();
  }

  /**
   * Updates a contact in Firestore.
   * 
   * @param contactData - The contact data to update in Firestore
   */
  private async updateContactInFirestore(contactData: Partial<Contact>): Promise<void> {
    const contactRef = doc(this.firestore, 'contacts', contactData.id!);
    await updateDoc(contactRef, {
      firstname: contactData.firstname,
      email: contactData.email,
      phone: contactData.phone,
      lastname: contactData.lastname ?? '',
    });
  }

  /**
   * Updates a contact in the local contacts array and selection.
   * 
   * @param contactData - The contact data to update locally
   */
  private updateLocalContact(contactData: Partial<Contact>): void {
    const idx = this.contacts.findIndex((c) => c.id === contactData.id);
    if (idx > -1) {
      this.contacts[idx] = { ...contactData } as Contact;
      this.selectedContact = this.contacts[idx];
    }
  }

  /**
   * Opens the delete confirmation modal.
   */
  openDeleteModal() {
    this.showDeleteModal = true;
  }

  /**
   * Closes the delete confirmation modal.
   */
  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  /**
   * Confirms and executes the delete operation for the selected contact.
   */
  async confirmDelete() {
    if (this.selectedContact) {
      await this.deleteContact(this.selectedContact);
      this.closeDeleteModal();
    }
  }

  /**
   * Deletes a contact from Firestore and updates local state.
   * Deselects the contact if it was currently selected.
   * 
   * @param contact - The contact to delete
   */
  async deleteContact(contact: Contact) {
    if (!contact.id) return;
    const contactRef = doc(this.firestore, 'contacts', contact.id);
    await deleteDoc(contactRef);
    await this.reloadContacts();
    this.contacts = this.contacts.filter((c) => c.id !== contact.id);
    if (this.selectedContact?.id === contact.id) {
      this.selectedContact = null;
    }
  }

  /**
   * Reloads all contacts from the database.
   */
  async reloadContacts() {
    this.contacts = await this.contactService.getAllContacts();
  }

  /**
   * Closes the add/edit modal and opens the delete modal.
   * Used when deleting a contact from the edit form.
   */
  openDeleteModalFromEdit() {
    this.closeAddModal();
    this.openDeleteModal();
  }

  /**
   * Handles the Escape key press to close the delete modal.
   */
  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showDeleteModal) {
      this.closeDeleteModal();
    }
  }

  /**
   * Handles clicks on the delete modal overlay to close it.
   * 
   * @param event - The mouse event from the overlay click
   */
  onDeleteOverlayClick(event: MouseEvent) {
    this.closeDeleteModal();
  }

  /**
   * Prevents click propagation on the delete modal content.
   * Ensures clicking inside the modal doesn't close it.
   * 
   * @param event - The mouse event to stop propagation on
   */
  onDeleteModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
