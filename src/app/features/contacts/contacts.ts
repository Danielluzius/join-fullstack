import { Component, OnInit, inject, HostListener } from '@angular/core';
import { ContactService } from '../../core/services/db-contact-service';
import { ContactHelper, Contact } from '../../core/interfaces/db-contact-interface';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { FormsModule } from '@angular/forms';
import { ContactList } from './contact-list/contact-list';
import { ContactDetails } from './contact-details/contact-details';
import { ContactForm } from './contact-form/contact-form';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
  standalone: true,
  imports: [FormsModule, ContactList, ContactDetails, ContactForm],
})
export class Contacts implements OnInit {
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  showAddModal = false;
  showDeleteModal = false;
  newContact: Partial<Contact> = {};
  showSuccess = false;
  isLoading = true;

  private contactService = inject(ContactService);
  private firestore = inject(Firestore);

  editMode = false;

  ngOnInit() {
    this.loadContacts();
  }

  async loadContacts() {
    this.isLoading = true;
    try {
      this.contacts = await this.contactService.getAllContacts();
    } finally {
      this.isLoading = false;
    }
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
  }

  deselectContact() {
    this.selectedContact = null;
  }

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

  closeAddModal() {
    this.showAddModal = false;
    this.editMode = false;
    this.newContact = {};
  }

  showSuccessAnimation() {
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 2000);
  }

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

  async handleSaveContact(contactData: Partial<Contact>) {
    if (!contactData.id) return;

    await this.updateContactInFirestore(contactData);
    this.updateLocalContact(contactData);
    await this.reloadContacts();
    this.closeAddModal();
  }

  private async updateContactInFirestore(contactData: Partial<Contact>): Promise<void> {
    const contactRef = doc(this.firestore, 'contacts', contactData.id!);
    await updateDoc(contactRef, {
      firstname: contactData.firstname,
      email: contactData.email,
      phone: contactData.phone,
      lastname: contactData.lastname ?? '',
    });
  }

  private updateLocalContact(contactData: Partial<Contact>): void {
    const idx = this.contacts.findIndex((c) => c.id === contactData.id);
    if (idx > -1) {
      this.contacts[idx] = { ...contactData } as Contact;
      this.selectedContact = this.contacts[idx];
    }
  }

  openDeleteModal() {
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
  }

  async confirmDelete() {
    if (this.selectedContact) {
      await this.deleteContact(this.selectedContact);
      this.closeDeleteModal();
    }
  }

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

  async reloadContacts() {
    this.contacts = await this.contactService.getAllContacts();
  }

  openDeleteModalFromEdit() {
    this.closeAddModal();
    this.openDeleteModal();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey() {
    if (this.showDeleteModal) {
      this.closeDeleteModal();
    }
  }

  onDeleteOverlayClick(event: MouseEvent) {
    this.closeDeleteModal();
  }

  onDeleteModalClick(event: MouseEvent) {
    event.stopPropagation();
  }
}
