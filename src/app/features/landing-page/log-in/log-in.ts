import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(private router: Router) {}

  onLogin() {
    // Login-Logik kommt später
    console.log('Login clicked');
  }

  onGuestLogin() {
    this.router.navigate(['/summary']);
  }

  navigateToSignUp() {
    this.router.navigate(['/signup']);
  }
}
