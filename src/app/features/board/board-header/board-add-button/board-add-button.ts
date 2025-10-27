import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-add-button',
  imports: [],
  templateUrl: './board-add-button.html',
  styleUrl: './board-add-button.scss',
  standalone: true
})
export class BoardAddButton {
  @Output() addTaskClicked = new EventEmitter<string>();

  onAddTaskClick() {
    // Sendet 'todo' als Standard-Status (wie im Design)
    this.addTaskClicked.emit('todo');
  }
}