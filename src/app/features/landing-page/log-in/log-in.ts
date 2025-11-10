import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './log-in.html',
  styleUrl: './log-in.scss',
  standalone: true,
})
export class LogIn {
  email = '';
  password = '';
  errorMessage = '';
  emailError = '';
  passwordError = '';
  isLoading = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  /**
   * ✅ Email-Validierung
   */
  validateEmail(): void {
    this.emailError = '';
    
    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }

    // Email-Format validieren
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }
  }

  /**
   * ✅ Password-Validierung
   */
  validatePassword(): void {
    this.passwordError = '';
    
    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    if (this.password.length < 6) {
      this.passwordError = 'Password must be at least 6 characters';
      return;
    }
  }

  /**
   * ✅ Login mit Validierung
   */
  async onLogin() {
    // Felder validieren
    this.validateEmail();
    this.validatePassword();

    // Bei Fehlern abbrechen
    if (this.emailError || this.passwordError) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const result = await this.authService.login({
      email: this.email,
      password: this.password
    });

    this.isLoading = false;

    if (result.success) {
      this.router.navigate(['/summary']);
    } else {
      this.errorMessage = result.message;
      
      // Spezifische Fehler zu Feldern zuordnen
      if (result.message.includes('email')) {
        this.emailError = 'Invalid email or password';
      } else if (result.message.includes('password')) {
        this.passwordError = 'Invalid email or password';
      }
    }
  }

  /**
   * Guest Login
   */
  onGuestLogin() {
    this.isLoading = true;
    
    const guestUser = {
      id: 'guest',
      email: 'guest@join.com',
      name: 'Guest User',
      password: '',
      createdAt: new Date()
    };
    
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    this.authService['currentUserSubject'].next(guestUser);
    
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/summary']);
    }, 300);
  }

  /**
   * Navigation zu Sign Up
   */
  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

  /**
   * ✅ Fehler beim Tippen zurücksetzen
   */
  onEmailInput(): void {
    if (this.emailError) {
      this.emailError = '';
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }

  onPasswordInput(): void {
    if (this.passwordError) {
      this.passwordError = '';
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  }
}