import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
} from '@angular/fire/firestore';
import { User, LoginCredentials, RegisterData } from '.././interfaces/users-interface';
import { Contact } from '../interfaces/db-contact-interface';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private firestore = inject(Firestore);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor() {
    this.checkLocalStorage();
    this.listenToStorageChanges();
  }

  /**
* Checks localStorage for a saved user and updates the current user subject if found.
*/
  private checkLocalStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }

  /**
 * Listens for changes to localStorage and handles user login/logout events across browser tabs.
 */
  private listenToStorageChanges(): void {
    window.addEventListener('storage', (event) => this.handleStorageEvent(event));
  }

  /**
* Handles the storage event for user login/logout synchronization.
*
* @param event - The storage event triggered by localStorage changes.
*/
  private handleStorageEvent(event: StorageEvent): void {
    if (event.key === 'currentUser') {
      if (event.newValue) {
        this.handleUserLoginFromStorage(event.newValue);
      } else {
        this.handleUserLogoutFromStorage();
      }
    }
  }

  /**
* Handles user login from a storage event by updating the current user and redirecting if needed.
*
* @param newValue - The new user value from localStorage.
*/
  private handleUserLoginFromStorage(newValue: string): void {
    try {
      const user = JSON.parse(newValue);
      this.currentUserSubject.next(user);
      this.redirectIfOnAuthPage();
    } catch (error) {
      console.error('Error parsing user from storage event:', error);
    }
  }

  /**
  * Redirects the user to the summary page if currently on an authentication page.
  */
  private redirectIfOnAuthPage(): void {
    if (this.router.url === '/login' || this.router.url === '/signup') {
      this.router.navigate(['/summary']);
    }
  }

  /**
 * Handles user logout from a storage event by clearing the current user and redirecting if needed.
 */
  private handleUserLogoutFromStorage(): void {
    this.currentUserSubject.next(null);
    this.redirectIfNotOnPublicPage();
  }

  /**
   * Redirects the user to the login page if not on a public page.
   */
  private redirectIfNotOnPublicPage(): void {
    const currentUrl = this.router.url;
    const publicPages = ['/login', '/signup', '/privacy-policy', '/legal-notice'];
    if (!publicPages.includes(currentUrl)) {
      this.router.navigate(['/login']);
    }
  }

  /**
 * Registers a new user in Firestore.
 *
 * @param data - The registration data for the new user.
 * @returns A promise resolving to an object with success status, message, and the created user (if successful).
 */
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const existingUser = await this.checkIfUserExists(data.email);
      if (existingUser) {
        return { success: false, message: 'Email already exists' };
      }
      const newUser = await this.createNewUser(data);
      await this.createContactFromUser(newUser);
      return { success: true, message: 'Registration successful', user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed' };
    }
  }

  /**
 * Checks if a user with the given email already exists in Firestore.
 *
 * @param email - The email address to check.
 * @returns A promise resolving to the user if found, or null.
 */
  private async checkIfUserExists(email: string): Promise<User | null> {
    return await this.getUserByEmail(email);
  }

  /**
 * Creates a new user in Firestore and returns the user object.
 *
 * @param data - The registration data for the new user.
 * @returns A promise resolving to the created user object.
 */
  private async createNewUser(data: RegisterData): Promise<User> {
    const hashedPassword = await this.hashPassword(data.password);
    const docRef = await this.addUserToFirestore(data, hashedPassword);
    return this.buildUserObject(docRef.id, data, hashedPassword);
  }

  /**
 * Adds a new user document to Firestore.
 *
 * @param data - The registration data for the new user.
 * @param hashedPassword - The hashed password to store.
 * @returns A promise resolving to the Firestore document reference.
 */
  private async addUserToFirestore(data: RegisterData, hashedPassword: string) {
    const usersRef = collection(this.firestore, 'users');
    return await addDoc(usersRef, {
      email: data.email,
      name: data.name,
      password: hashedPassword,
      createdAt: Timestamp.now()
    });
  }

  /**
 * Builds a User object from the provided data and Firestore document ID.
 *
 * @param id - The Firestore document ID.
 * @param data - The registration data.
 * @param hashedPassword - The hashed password.
 * @returns The constructed User object.
 */
  private buildUserObject(id: string, data: RegisterData, hashedPassword: string): User {
    return {
      id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date()
    };
  }

  /**
 * Creates a contact entry in Firestore for the given user.
 *
 * @param user - The user for whom to create the contact.
 * @returns A promise that resolves when the contact is created.
 */
  private async createContactFromUser(user: User): Promise<void> {
    try {
      const contact = this.buildContactFromUser(user);
      await this.saveContactToFirestore(contact);
      console.log('Contact created for user:', user.email);
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  }

  /**
 * Builds a Contact object (without ID) from a User object.
 *
 * @param user - The user to convert to a contact.
 * @returns The constructed Contact object.
 */
  private buildContactFromUser(user: User): Omit<Contact, 'id'> {
    return {
      firstname: user.name,
      lastname: '',
      email: user.email,
      phone: ''
    };
  }

  /**
 * Saves a contact object to Firestore.
 *
 * @param contact - The contact object to save.
 * @returns A promise that resolves when the contact is saved.
 */
  private async saveContactToFirestore(contact: Omit<Contact, 'id'>): Promise<void> {
    const contactsRef = collection(this.firestore, 'contacts');
    await addDoc(contactsRef, contact);
  }

  /**
 * Authenticates a user with the provided login credentials.
 *
 * @param credentials - The login credentials (email and password).
 * @returns A promise resolving to an object with success status, message, and the user (if successful).
 */
  async login(credentials: LoginCredentials): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const user = await this.getUserByEmail(credentials.email);
      if (!user) return this.loginFailed();
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      if (!isPasswordValid) return this.loginFailed();
      return this.handleLoginSuccess(user);
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed' };
    }
  }

  /**
 * Handles a successful login by updating localStorage and the current user subject.
 *
 * @param user - The authenticated user.
 * @returns An object indicating login success and the user (without password).
 */
  private handleLoginSuccess(user: User) {
    const userWithoutPassword = { ...user, password: '' };
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    this.currentUserSubject.next(userWithoutPassword);
    return { success: true, message: 'Login successful', user: userWithoutPassword };
  }

  /**
 * Returns a standard failed login response.
 *
 * @returns An object indicating login failure.
 */
  private loginFailed() {
    return { success: false, message: 'Invalid email or password' };
  }

  /**
 * Logs in as a guest user and updates localStorage and the current user subject.
 */
  loginAsGuest(): void {
    const guestUser: User = {
      id: 'guest',
      email: 'guest@join.com',
      name: 'Guest User',
      password: '',
      createdAt: new Date()
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    this.currentUserSubject.next(guestUser);
  }

  /**
 * Logs out the current user by clearing localStorage and the current user subject.
 */
  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  /**
 * Checks if a user is currently logged in.
 *
 * @returns True if a user is logged in, otherwise false.
 */
  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
 * Gets the current user object.
 *
 * @returns The current user, or null if not logged in.
 */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
 * Retrieves a user by email from Firestore.
 *
 * @param email - The email address to search for.
 * @returns A promise resolving to the user if found, or null.
 */
  private async getUserByEmail(email: string): Promise<User | null> {
    const usersRef = collection(this.firestore, 'users');
    const q = query(usersRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data() as User
    };
  }

  /**
 * Hashes a password using SHA-256.
 *
 * @param password - The password to hash.
 * @returns A promise resolving to the hashed password as a hex string.
 */
  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  /**
 * Verifies if the input password matches the stored hash.
 *
 * @param inputPassword - The password to verify.
 * @param storedHash - The stored hashed password.
 * @returns A promise resolving to true if the password matches, otherwise false.
 */
  private async verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
    const inputHash = await this.hashPassword(inputPassword);
    return inputHash === storedHash;
  }
}