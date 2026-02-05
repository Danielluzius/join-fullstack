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
  capsLockOn = false;

  showPassword = false;
  passwordIconSrc = 'assets/signup/lock-signup.png';
  passwordTouched = false;

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
    if (!this.passwordTouched) return;

    this.passwordError = '';

    if (!this.password) {
      this.passwordError = 'Password is required';
      return;
    }

    if (this.password.length < 8) {
      this.passwordError = 'Password must be at least 8 characters';
      return;
    }
  }

  onPasswordKeydown(event: KeyboardEvent): void {
    this.capsLockOn = event.getModifierState('CapsLock');
  }

  onPasswordBlur(): void {
    this.validatePassword();
  }

  async onLogin() {
    this.passwordTouched = true;
    this.validateEmail();
    this.validatePassword();

    if (this.hasValidationErrors()) return;

    this.isLoading = true;
    this.errorMessage = '';
    const result = await this.authService.login({
      email: this.email,
      password: this.password,
    });
    this.isLoading = false;

    this.handleLoginResult(result);
  }

  private hasValidationErrors(): boolean {
    return !!(this.emailError || this.passwordError);
  }

  private handleLoginResult(result: any): void {
    if (result.success) {
      this.handleSuccessfulLogin();
    } else {
      this.handleLoginError(result.message);
    }
  }

  private handleSuccessfulLogin(): void {
    sessionStorage.setItem('justLoggedIn', 'true');
    this.router.navigate(['/summary']);
  }

  private handleLoginError(message: string): void {
    this.errorMessage = message;
    if (message.includes('email')) {
      this.emailError = 'Invalid email or password';
    } else if (message.includes('password')) {
      this.passwordError = 'Invalid email or password';
    }
  }

  async onGuestLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    const result = await this.authService.login({
      email: 'guest@join.com',
      password: 'guest123',
    });

    this.isLoading = false;

    if (result.success) {
      sessionStorage.setItem('justLoggedIn', 'true');
      this.router.navigate(['/summary']);
    } else {
      this.errorMessage = 'Guest login failed. Please try again.';
      console.error('Guest login error:', result.message);
    }
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
    this.passwordTouched = true;
    if (this.passwordError) {
      this.passwordError = '';
    }
    if (this.errorMessage) {
      this.errorMessage = '';
    }
    this.updatePasswordIcon();
  }

  updatePasswordIcon(): void {
    if (this.password.length === 0) {
      this.passwordIconSrc = 'assets/signup/lock-signup.png';
    } else {
      this.passwordIconSrc = this.showPassword
        ? 'assets/signup/eye.png'
        : 'assets/signup/eye-crossed-signup.png';
    }
  }

  onPasswordIconHover(isHovering: boolean): void {
    if (this.password.length === 0) return;

    if (isHovering) {
      this.passwordIconSrc = this.showPassword
        ? 'assets/signup/eye-crossed-signup.png'
        : 'assets/signup/eye.png';
    } else {
      this.passwordIconSrc = this.showPassword
        ? 'assets/signup/eye.png'
        : 'assets/signup/eye-crossed-signup.png';
    }
  }

  togglePasswordVisibility(): void {
    if (this.password.length === 0) return;

    this.showPassword = !this.showPassword;
    this.updatePasswordIcon();
  }
}
