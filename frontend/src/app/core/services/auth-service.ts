import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User, LoginCredentials, RegisterData } from '.././interfaces/users-interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';

interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
    username: string;
    createdAt: string;
  };
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();
  private apiUrl = environment.apiUrl;

  constructor() {
    this.checkLocalStorage();
    this.listenToStorageChanges();
  }

  /**
   * Checks localStorage for a saved user and token, updates the current user subject if found.
   */
  private checkLocalStorage(): void {
    const savedUser = localStorage.getItem('currentUser');
    const savedToken = localStorage.getItem('authToken');
    if (savedUser && savedToken) {
      try {
        const user = JSON.parse(savedUser);
        this.currentUserSubject.next(user);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('authToken');
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
   * Registers a new user via the Django backend API.
   *
   * @param data - The registration data for the new user.
   * @returns A promise resolving to an object with success status, message, and the created user (if successful).
   */
  async register(data: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const payload = {
        email: data.email,
        name: data.name,
        password: data.password,
        confirm_password: data.confirmPassword,
        accept_privacy_policy: data.acceptPrivacyPolicy,
      };

      const response = await this.http
        .post<AuthResponse>(`${this.apiUrl}/auth/register/`, payload)
        .toPromise();

      if (response && response.user && response.token) {
        const user = this.mapBackendUserToFrontend(response.user);
        this.saveUserAndToken(user, response.token);
        return { success: true, message: 'Registration successful', user };
      }

      return { success: false, message: 'Registration failed' };
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage =
        error.error?.email?.[0] ||
        error.error?.password?.[0] ||
        error.error?.error ||
        'Registration failed';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Maps a backend user object to the frontend User interface.
   */
  private mapBackendUserToFrontend(backendUser: any): User {
    return {
      id: backendUser.id.toString(),
      email: backendUser.email,
      name: backendUser.name,
      password: '', // Never store password in frontend
      createdAt: new Date(backendUser.createdAt),
    };
  }

  /**
   * Saves user and token to localStorage and updates the current user subject.
   */
  private saveUserAndToken(user: User, token: string): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('authToken', token);
    this.currentUserSubject.next(user);
  }

  /**
   * Authenticates a user via the Django backend API.
   *
   * @param credentials - The login credentials (email and password).
   * @returns A promise resolving to an object with success status, message, and the user (if successful).
   */
  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const payload = {
        email: credentials.email,
        password: credentials.password,
      };

      const response = await this.http
        .post<AuthResponse>(`${this.apiUrl}/auth/login/`, payload)
        .toPromise();

      if (response && response.user && response.token) {
        const user = this.mapBackendUserToFrontend(response.user);
        this.saveUserAndToken(user, response.token);
        return { success: true, message: 'Login successful', user };
      }

      return { success: false, message: 'Invalid email or password' };
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.error?.error || 'Invalid email or password';
      return { success: false, message: errorMessage };
    }
  }

  /**
   * Logs out the current user by clearing localStorage, calling backend logout, and clearing the current user subject.
   */
  async logout(): Promise<void> {
    const token = localStorage.getItem('authToken');

    // Call backend logout endpoint if token exists
    if (token) {
      try {
        const headers = new HttpHeaders({
          Authorization: `Token ${token}`,
        });
        await this.http.post(`${this.apiUrl}/auth/logout/`, {}, { headers }).toPromise();
      } catch (error) {
        console.error('Logout API error:', error);
      }
    }

    // Clear local storage and user state
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authToken');
    this.currentUserSubject.next(null);

    // Navigate to login page
    this.router.navigate(['/login']);
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
}
