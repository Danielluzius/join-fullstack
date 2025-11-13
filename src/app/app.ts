import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Header } from './shared/components/header/header';
import { Navbar } from './shared/components/navbar/navbar';
import { ContactService } from './core/services/db-contact-service';
import { Contact } from './core/interfaces/db-contact-interface';
import { filter } from 'rxjs/operators';
import { BoardTasksService } from './core/services/board-tasks-service';
import { Task } from './core/interfaces/board-tasks-interface';

/**
 * Root component of the application.
 * Handles navigation visibility based on current route and loads contacts on initialization.
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Navbar, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {

  contacts: Contact[] = [];
  tasks: Task[] = [];


  showNavigation = false;

  private hasReloaded = false;

  private contactService = inject(ContactService);
  private boardTasksService = inject(BoardTasksService);
  private router = inject(Router);

  /**
   * Lifecycle hook that runs on component initialization.
   * Checks the current route, loads contacts, and subscribes to route changes.
   */
  async ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.checkRoute(event.url);
      });

    this.checkRoute(this.router.url);
    if (sessionStorage.getItem('hasReloaded')) {
      this.hasReloaded = true;
    }

    const healthCheckPromise = this.boardTasksService.checkFirebaseConnection();
    const timeoutPromise = new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 2000));
    const isConnected = await Promise.race([healthCheckPromise, timeoutPromise]);
    
    if (!isConnected && !this.hasReloaded) {
      console.warn('Firebase not reachable, reloading once...');
      sessionStorage.setItem('hasReloaded', 'true');
      setTimeout(() => location.reload(), 1000);
    }
    this.contactService.getAllContacts().then((contacts) => {
      this.contacts = contacts;
    });

    this.boardTasksService.getAllTasks().subscribe(tasks => {
      this.tasks = tasks;
    });
  }

  /**
   * Checks if the current route requires navigation components.
   * Hides navigation on authentication routes (login, signup, root).
   * 
   * @param url - The current route URL
   */
  private checkRoute(url: string) {
    const authRoutes = ['/', '/login', '/signup'];
    this.showNavigation = !authRoutes.includes(url);
  }
}