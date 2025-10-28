import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-board-add-button',
  imports: [],
  templateUrl: './board-add-button.html',
  styleUrl: './board-add-button.scss',
  standalone: true
})
export class BoardAddButton {
  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}