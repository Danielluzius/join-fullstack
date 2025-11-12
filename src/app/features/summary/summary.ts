import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardTasksService } from '../../core/services/board-tasks-service';
import { Task } from '../../core/interfaces/board-tasks-interface';
import { Subscription } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../core/services/auth-service';

@Component({
  selector: 'app-summary',
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary implements OnInit, OnDestroy {
  private boardTasksService = inject(BoardTasksService);
  private router = inject(Router);
  private tasksSubscription?: Subscription;
  private authService = inject(AuthService);

  todoIconSrc: string = 'assets/summary/edit-white-signup.png';
  doneIconSrc: string = 'assets/summary/done-checkmark.png';

  todoCount: number = 0;
  doneCount: number = 0;
  urgentCount: number = 0;
  tasksInBoardCount: number = 0;
  tasksInProgressCount: number = 0;
  awaitingFeedbackCount: number = 0;
  upcomingDeadline: string = 'No deadline';

  greeting = '';
  username = 'Guest';

  showGreetingOverlay = false;
  greetingTimeOfDay = '';

  ngOnInit(): void {
    this.loadTaskStatistics();
    this.loadUserData();
    this.setGreeting();
    this.checkAndShowWelcome();
  }

  ngOnDestroy(): void {
    if (this.tasksSubscription) {
      this.tasksSubscription.unsubscribe();
    }
  }

  /**
 * Loads and subscribes to all tasks, then calculates statistics.
 */
  private loadTaskStatistics(): void {
    this.tasksSubscription = this.boardTasksService.getAllTasks().subscribe((tasks: Task[]) => {
      this.calculateStatistics(tasks);
    });
  }

  /**
 * Loads the current user's data and sets the username.
 */
  loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.name || 'User';
    } else {
      this.username = 'Guest';
    }
  }

  /**
 * Sets the greeting message and time of day based on the current hour.
 */
  setGreeting() {
    const hour = new Date().getHours();
    const greetingData = this.getGreetingByHour(hour);
    this.greeting = greetingData.greeting;
    this.greetingTimeOfDay = greetingData.timeOfDay;
  }

  /**
 * Returns the appropriate greeting and time of day for a given hour.
 *
 * @param hour - The current hour (0-23).
 * @returns An object with greeting and timeOfDay.
 */
  private getGreetingByHour(hour: number): { greeting: string; timeOfDay: string } {
    if (hour >= 5 && hour < 12) {
      return { greeting: 'Good morning', timeOfDay: 'morning' };
    } else if (hour >= 12 && hour < 18) {
      return { greeting: 'Good afternoon', timeOfDay: 'afternoon' };
    } else if (hour >= 18 && hour < 22) {
      return { greeting: 'Good evening', timeOfDay: 'evening' };
    } else {
      return { greeting: 'Good night', timeOfDay: 'night' };
    }
  }

  /**
 * Checks if the welcome overlay should be shown after login (on small screens).
 */
  private checkAndShowWelcome(): void {
    if (window.innerWidth >= 1250) return;
    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      this.displayWelcomeOverlay();
    }
  }

  /**
 * Displays the welcome overlay and hides it after a timeout.
 */
  private displayWelcomeOverlay(): void {
    sessionStorage.removeItem('justLoggedIn');
    this.showGreetingOverlay = true;
    setTimeout(() => {
      this.showGreetingOverlay = false;
    }, 2000);
  }

  /**
 * Calculates and updates all task-related statistics and the upcoming deadline.
 *
 * @param tasks - The array of tasks to analyze.
 */
  private calculateStatistics(tasks: Task[]): void {
    this.todoCount = tasks.filter((t) => t.status === 'todo').length;
    this.doneCount = tasks.filter((t) => t.status === 'done').length;
    this.urgentCount = tasks.filter((t) => t.priority === 'urgent').length;
    this.tasksInBoardCount = tasks.length;
    this.tasksInProgressCount = tasks.filter((t) => t.status === 'inprogress').length;
    this.awaitingFeedbackCount = tasks.filter((t) => t.status === 'awaitfeedback').length;
    this.upcomingDeadline = this.calculateUpcomingDeadline(tasks);
  }

  /**
 * Calculates the upcoming deadline based on the highest-priority tasks.
 *
 * @param tasks - The array of tasks to analyze.
 * @returns The formatted upcoming deadline or 'No deadline'.
 */
  private calculateUpcomingDeadline(tasks: Task[]): string {
    const tasksWithDueDate = this.filterTasksWithUrgentDeadline(tasks);
    if (tasksWithDueDate.length === 0) {
      return 'No deadline';
    }
    const earliestTask = this.findEarliestTask(tasksWithDueDate);
    return this.formatDeadline(earliestTask.dueDate!);
  }

  /**
 * Filters tasks to only include those with a due date, not done, and with 'urgent' priority.
 *
 * @param tasks - The array of tasks to filter.
 * @returns An array of filtered tasks.
 */
  private filterTasksWithUrgentDeadline(tasks: Task[]): Task[] {
    return tasks.filter(
      (t) => t.dueDate && t.status !== 'done' && t.priority !== 'low' && t.priority !== 'medium'
    );
  }

  /**
 * Finds the task with the earliest due date from a list of tasks.
 *
 * @param tasks - The array of tasks to search.
 * @returns The task with the earliest due date.
 */
  private findEarliestTask(tasks: Task[]): Task {
    return tasks.sort((a, b) => {
      const dateA = this.getDateFromDueDate(a.dueDate!);
      const dateB = this.getDateFromDueDate(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    })[0];
  }

  /**
 * Converts a due date (string or Timestamp) to a Date object.
 *
 * @param dueDate - The due date as a string or Firestore Timestamp.
 * @returns The corresponding Date object.
 */
  private getDateFromDueDate(dueDate: string | Timestamp): Date {
    if (typeof dueDate === 'string') {
      const [day, month, year] = dueDate.split('/').map(Number);
      return new Date(year, month - 1, day);
    } else {
      return dueDate.toDate();
    }
  }

  /**
 * Formats a due date (string or Timestamp) as a human-readable string.
 *
 * @param dueDate - The due date to format.
 * @returns The formatted date string.
 */
  private formatDeadline(dueDate: string | Timestamp): string {
    const date = this.getDateFromDueDate(dueDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  /**
 * Handles hover state for the todo icon and updates its source accordingly.
 *
 * @param isHovering - Whether the icon is being hovered.
 */
  onTodoHover(isHovering: boolean): void {
    if (isHovering) {
      this.todoIconSrc = 'assets/summary/edit-black-signup.png';
    } else {
      this.todoIconSrc = 'assets/summary/edit-white-signup.png';
    }
  }

  /**
 * Handles hover state for the done icon and updates its source accordingly.
 *
 * @param isHovering - Whether the icon is being hovered.
 */
  onDoneHover(isHovering: boolean): void {
    if (isHovering) {
      this.doneIconSrc = 'assets/summary/done-checkmark-hover.png';
    } else {
      this.doneIconSrc = 'assets/summary/done-checkmark.png';
    }
  }

  /**
 * Navigates to the board page, optionally with a filter query parameter.
 *
 * @param filter - (Optional) The filter to apply on the board.
 */
  navigateToBoard(filter?: string): void {
    if (filter) {
      this.router.navigate(['/board'], { queryParams: { filter } });
    } else {
      this.router.navigate(['/board']);
    }
  }
}
