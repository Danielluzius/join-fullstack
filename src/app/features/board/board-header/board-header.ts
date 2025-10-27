import { Component, Output, EventEmitter } from '@angular/core';
import { BoardAddButton } from './board-add-button/board-add-button';

@Component({
  selector: 'app-board-header',
  imports: [BoardAddButton],
  templateUrl: './board-header.html',
  styleUrl: './board-header.scss',
  standalone: true,
})
export class BoardHeader {
  @Output() addTaskClicked = new EventEmitter<string>();

  onAddTaskClick(status: string) {
    this.addTaskClicked.emit(status);
  }
}