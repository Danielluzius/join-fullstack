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

  private loadTaskStatistics(): void {
    this.tasksSubscription = this.boardTasksService.getAllTasks().subscribe((tasks: Task[]) => {
      this.calculateStatistics(tasks);
    });
  }

  loadUserData() {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.username = currentUser.name || 'User';
    } else {
      this.username = 'Guest';
    }
  }

  setGreeting() {
    const hour = new Date().getHours();
    const greetingData = this.getGreetingByHour(hour);
    this.greeting = greetingData.greeting;
    this.greetingTimeOfDay = greetingData.timeOfDay;
  }

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

  private checkAndShowWelcome(): void {
    if (window.innerWidth >= 1250) return;

    const justLoggedIn = sessionStorage.getItem('justLoggedIn');
    if (justLoggedIn === 'true') {
      this.displayWelcomeOverlay();
    }
  }

  private displayWelcomeOverlay(): void {
    sessionStorage.removeItem('justLoggedIn');
    this.showGreetingOverlay = true;

    setTimeout(() => {
      this.showGreetingOverlay = false;
    }, 2000);
  }

  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map((num) => parseInt(num, 10));
    return new Date(year, month - 1, day);
  }

  private calculateStatistics(tasks: Task[]): void {
    this.todoCount = tasks.filter((t) => t.status === 'todo').length;
    this.doneCount = tasks.filter((t) => t.status === 'done').length;
    this.urgentCount = tasks.filter((t) => t.priority === 'urgent').length;
    this.tasksInBoardCount = tasks.length;
    this.tasksInProgressCount = tasks.filter((t) => t.status === 'inprogress').length;
    this.awaitingFeedbackCount = tasks.filter((t) => t.status === 'awaitfeedback').length;
    this.upcomingDeadline = this.calculateUpcomingDeadline(tasks);
  }

  private calculateUpcomingDeadline(tasks: Task[]): string {
    const tasksWithDueDate = this.filterTasksWithUrgentDeadline(tasks);

    if (tasksWithDueDate.length === 0) {
      return 'No deadline';
    }

    const earliestTask = this.findEarliestTask(tasksWithDueDate);
    return this.formatDeadline(earliestTask.dueDate!);
  }

  private filterTasksWithUrgentDeadline(tasks: Task[]): Task[] {
    return tasks.filter(
      (t) => t.dueDate && t.status !== 'done' && t.priority !== 'low' && t.priority !== 'medium'
    );
  }

  private findEarliestTask(tasks: Task[]): Task {
    return tasks.sort((a, b) => {
      const dateA = this.getDateFromDueDate(a.dueDate!);
      const dateB = this.getDateFromDueDate(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    })[0];
  }

  private getDateFromDueDate(dueDate: string | Timestamp): Date {
    if (typeof dueDate === 'string') {
      const [day, month, year] = dueDate.split('/').map(Number);
      return new Date(year, month - 1, day);
    } else {
      return dueDate.toDate();
    }
  }

  private formatDeadline(dueDate: string | Timestamp): string {
    const date = this.getDateFromDueDate(dueDate);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  }

  onTodoHover(isHovering: boolean): void {
    if (isHovering) {
      this.todoIconSrc = 'assets/summary/edit-black-signup.png';
    } else {
      this.todoIconSrc = 'assets/summary/edit-white-signup.png';
    }
  }

  onDoneHover(isHovering: boolean): void {
    if (isHovering) {
      this.doneIconSrc = 'assets/summary/done-checkmark-hover.png';
    } else {
      this.doneIconSrc = 'assets/summary/done-checkmark.png';
    }
  }

  navigateToBoard(filter?: string): void {
    if (filter) {
      this.router.navigate(['/board'], { queryParams: { filter } });
    } else {
      this.router.navigate(['/board']);
    }
  }
}
