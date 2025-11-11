import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth-service';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.scss',
  standalone: true,
})
export class SignUp {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  acceptPrivacyPolicy = false;
  errorMessage = '';
  isLoading = false;
  showSuccessMessage = false;
  checkboxImageSrc = 'assets/check-box/check-box.png';

  showPassword = false;
  showConfirmPassword = false;

  passwordIconSrc = 'assets/signup/lock-signup.png';
  confirmPasswordIconSrc = 'assets/signup/lock-signup.png';


  fieldErrors: Record<string, string> = {};

  private router = inject(Router);
  private authService = inject(AuthService);

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async onSignUp() {
    this.errorMessage = '';
    this.fieldErrors = {};
    const fieldErrors: Record<string, string> = {};

    if (!this.name.trim()) {
      fieldErrors['name'] = 'Name is required';
    }

    if (!this.email.trim()) {
      fieldErrors['email'] = 'Email is required';
    } else if (!this.isValidEmail(this.email.trim())) {
      fieldErrors['email'] = 'Please enter a valid email address';
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
    }

    if (!this.password) {
      fieldErrors['password'] = 'Password is required';
    } else if (this.password.length < 6) {
      fieldErrors['password'] = 'Password must be at least 6 characters';
    }

    if (!this.confirmPassword) {
      fieldErrors['confirmPassword'] = 'Please confirm your password';
    } else if (this.password !== this.confirmPassword) {
      fieldErrors['confirmPassword'] = 'Passwords do not match';
    }

    if (!this.acceptPrivacyPolicy) {
      this.errorMessage = 'Please accept the privacy policy';
    }

    this.fieldErrors = fieldErrors;

    if (Object.keys(fieldErrors).length > 0 || this.errorMessage) {
      return;
    }


    this.isLoading = true;
    this.errorMessage = '';

    const result = await this.authService.register({
      email: this.email,
      name: this.name,
      password: this.password,
      confirmPassword: this.confirmPassword,
      acceptPrivacyPolicy: this.acceptPrivacyPolicy
    });

    this.isLoading = false;

    if (result.success) {
      this.showSuccessMessage = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    } else {
      this.errorMessage = result.message;
    }
  }

  goBackToLogin() {
    this.router.navigate(['/login']);
  }

  onCheckboxHover(isHovering: boolean) {
    if (this.acceptPrivacyPolicy) {
      this.checkboxImageSrc = isHovering
        ? 'assets/check-box/checkbox-checked-hovered.png'
        : 'assets/check-box/check-box-checked.png';
    } else {
      this.checkboxImageSrc = isHovering
        ? 'assets/check-box/check-box-hovered.png'
        : 'assets/check-box/check-box.png';
    }
  }

  onCheckboxChange() {
    this.checkboxImageSrc = this.acceptPrivacyPolicy
      ? 'assets/check-box/check-box-checked.png'
      : 'assets/check-box/check-box.png';
  }

  onPasswordIconHover(isHovering: boolean): void {
  if (!isHovering) {
    this.passwordIconSrc = this.showPassword 
      ? 'assets/signup/eye.png' 
      : 'assets/signup/lock-signup.png';
  } else {
    this.passwordIconSrc = this.showPassword 
      ? 'assets/signup/eye-crossed-signup.png' 
      : 'assets/signup/eye.png';
  }
}

onConfirmPasswordIconHover(isHovering: boolean): void {
  if (!isHovering) {
    this.confirmPasswordIconSrc = this.showConfirmPassword 
      ? 'assets/signup/eye.png' 
      : 'assets/signup/lock-signup.png';
  } else {
    this.confirmPasswordIconSrc = this.showConfirmPassword 
      ? 'assets/signup/eye-crossed-signup.png' 
      : 'assets/signup/eye.png';
  }
}

togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
  this.passwordIconSrc = this.showPassword 
    ? 'assets/signup/eye.png' 
    : 'assets/signup/lock-signup.png';
}

toggleConfirmPasswordVisibility(): void {
  this.showConfirmPassword = !this.showConfirmPassword;
  this.confirmPasswordIconSrc = this.showConfirmPassword 
    ? 'assets/signup/eye.png' 
    : 'assets/signup/lock-signup.png';
}
}