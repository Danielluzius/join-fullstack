import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BoardAddButton } from './board-add-button/board-add-button';
import { BoardSearch } from './board-search/board-search';

@Component({
  selector: 'app-board-header',
  imports: [BoardAddButton, BoardSearch, CommonModule],
  templateUrl: './board-header.html',
  styleUrl: './board-header.scss',
  standalone: true,
})
export class BoardHeader {
  @Input() searchError = '';
  @Output() addTaskClick = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();


  constructor(private router: Router) {}

  /**
 * Emits an event when the add task button is clicked.
 */
  onButtonClick() {
    this.addTaskClick.emit();
  }

  /**
 * Emits the search query string when the search input changes.
 *
 * @param query - The search query entered by the user.
 */
  onSearch(query: string) {
    this.searchQuery.emit(query);
  }

  /**
 * Handles the add task button click on mobile devices.
 * Navigates to the add task page if the screen width is less than 1350px, otherwise emits the addTaskClick event.
 */
  onMobileAddTaskClick(): void {
    if (window.innerWidth < 1350) {
      this.router.navigate(['/add-task']);
    } else {
      this.addTaskClick.emit();
    }
  }
}