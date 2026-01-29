import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  standalone: true,
})
export class Header implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private userSubscription?: Subscription;

  userInitials = 'G';
  userName = 'Guest';
  showDropdown = false;
  isLoggedIn = false; 

  /**
 * Lifecycle hook that is called after component initialization.
 * Subscribes to the current user and updates user information and login status.
 */
  ngOnInit() {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user && user.name) {
        this.userName = user.name;
        this.userInitials = this.getInitials(user.name);
      } else {
        this.userName = 'Guest';
        this.userInitials = 'G';
      }
    });
  }

  /**
 * Lifecycle hook that is called when the component is destroyed.
 * Unsubscribes from the user subscription to prevent memory leaks.
 */
  ngOnDestroy() {
    this.userSubscription?.unsubscribe();
  }

  /**
 * Returns the initials for the given user name.
 *
 * @param name - The full name of the user.
 * @returns The initials as a string.
 */
  getInitials(name: string): string {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return 'G';
  }

  /**
 * Toggles the visibility of the user dropdown menu.
 */
  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  /**
 * Closes the user dropdown menu.
 */
  closeDropdown() {
    this.showDropdown = false;
  }

  /**
 * Navigates to the legal notice page and closes the dropdown.
 */
  navigateToLegalNotice() {
    this.showDropdown = false;
    this.router.navigate(['/legal-notice']);
  }

  /**
 * Navigates to the privacy policy page and closes the dropdown.
 */
  navigateToPrivacyPolicy() {
    this.showDropdown = false;
    this.router.navigate(['/privacy-policy']);
  }

  
/**
 * Logs out the current user, closes the dropdown, and navigates to the login page.
 */
  logout() {
    this.authService.logout();
    this.showDropdown = false;
    this.router.navigate(['/login']);
  }

  /**
 * Navigates to the help page and closes the dropdown.
 */
  navigateToHelp() {
    this.showDropdown = false;
    this.router.navigate(['/help']);
  }
}