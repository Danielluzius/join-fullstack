import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';
import { Header } from '../../../shared/components/header/header';
import { Navbar } from '../../../shared/components/navbar/navbar';

@Component({
  selector: 'app-log-in',
  imports: [CommonModule, FormsModule, RouterModule, Header, Navbar],
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
  showWelcome = false;
  welcomeUserName = '';
  timeOfDay = 'morning';
  capsLockOn = false;
  fadeOutWelcome = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  validateEmail(): void {
    this.emailError = '';

    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }
  }

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
   *  Caps Lock Detection
   */
  onPasswordKeydown(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState('CapsLock');
  }

  /**
   *  Caps Lock bei Blur zurücksetzen
   */
  onPasswordBlur(): void {
    this.validatePassword();
  }

  async onLogin() {
    this.validateEmail();
    this.validatePassword();
    if (this.emailError || this.passwordError) {
      return;
    }
    this.isLoading = true;
    this.errorMessage = '';
    const result = await this.authService.login({
      email: this.email,
      password: this.password,
    });
    this.isLoading = false;

    if (result.success) {
      if (window.innerWidth < 1250 && result.user?.name) {
        this.showWelcomeAnimation(result.user.name);
      } else {
        this.router.navigate(['/summary']);
      }
    } else {
      this.errorMessage = result.message;
      if (result.message.includes('email')) {
        this.emailError = 'Invalid email or password';
      } else if (result.message.includes('password')) {
        this.passwordError = 'Invalid email or password';
      }
    }
  }

  onGuestLogin() {
    this.isLoading = true;

    const guestUser = {
      id: 'guest',
      email: 'guest@join.com',
      name: 'Guest User',
      password: '',
      createdAt: new Date(),
    };
    localStorage.setItem('currentUser', JSON.stringify(guestUser));
    this.authService['currentUserSubject'].next(guestUser);
    setTimeout(() => {
      this.isLoading = false;
      if (window.innerWidth < 1250) {
        this.showWelcomeAnimation('Guest User');
      } else {
        this.router.navigate(['/summary']);
      }
    }, 300);
  }

  private showWelcomeAnimation(userName: string): void {
    const hour = new Date().getHours();
    if (hour < 12) {
      this.timeOfDay = 'morning';
    } else if (hour < 18) {
      this.timeOfDay = 'afternoon';
    } else {
      this.timeOfDay = 'evening';
    }

    this.welcomeUserName = userName;
    this.showWelcome = true;
    this.fadeOutWelcome = false;

    // Nach 1.5 Sekunden Anzeige: Erst navigieren, dann ausblenden
    setTimeout(() => {
      // Sofort zur Summary navigieren (im Hintergrund)
      this.router.navigate(['/summary']).then(() => {
        // Nach erfolgreicher Navigation das Ausblenden starten
        this.fadeOutWelcome = true;
        // Nach der Fade-out Animation das Overlay entfernen
        setTimeout(() => {
          this.showWelcome = false;
        }, 800);
      });
    }, 1500);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }

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
