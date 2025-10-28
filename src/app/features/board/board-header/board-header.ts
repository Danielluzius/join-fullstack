import { Component, Output, EventEmitter, Input } from '@angular/core';
import { BoardAddButton } from './board-add-button/board-add-button';
import { BoardSearch } from './board-search/board-search';

@Component({
  selector: 'app-board-header',
  imports: [BoardAddButton, BoardSearch],
  templateUrl: './board-header.html',
  styleUrl: './board-header.scss',
  standalone: true,
})
export class BoardHeader {
  @Input() searchError = '';
  @Output() addTaskClick = new EventEmitter<void>();
  @Output() searchQuery = new EventEmitter<string>();

  onButtonClick() {
    this.addTaskClick.emit();
  }

  onSearch(query: string) {
    this.searchQuery.emit(query);
  }
}