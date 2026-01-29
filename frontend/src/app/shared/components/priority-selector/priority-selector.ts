import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-priority-selector',
  imports: [CommonModule],
  templateUrl: './priority-selector.html',
  styleUrl: './priority-selector.scss',
  standalone: true,
})
export class PrioritySelectorComponent {

  /**
 * The currently selected priority.
 * 
 * @type {'urgent' | 'medium' | 'low'}
 * @default 'medium'
 */
  @Input() priority: 'urgent' | 'medium' | 'low' = 'medium';

  /**
 * Event emitted when the priority changes.
 * 
 * @event
 * @type {EventEmitter<'urgent' | 'medium' | 'low'>}
 */
  @Output() priorityChange = new EventEmitter<'urgent' | 'medium' | 'low'>();

  /**
 * Sets the selected priority and emits the change event.
 *
 * @param priority - The new priority to set ('urgent', 'medium', or 'low').
 */
  setPriority(priority: 'urgent' | 'medium' | 'low') {
    this.priority = priority;
    this.priorityChange.emit(priority);
  }
}
