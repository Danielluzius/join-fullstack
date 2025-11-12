import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subtask } from '../../../core/interfaces/board-tasks-interface';

@Component({
  selector: 'app-subtask-manager',
  imports: [CommonModule, FormsModule],
  templateUrl: './subtask-manager.html',
  styleUrl: './subtask-manager.scss',
  standalone: true,
})
export class SubtaskManagerComponent {
  /**
 * Emits when the subtasks array changes.
 * 
 * @event
 * @type {EventEmitter<Subtask[]>}
 */

  @Input() subtasks: Subtask[] = [];
  @Output() subtasksChange = new EventEmitter<Subtask[]>();

  newSubtaskTitle = '';
  editingSubtaskId: string | null = null;
  subtaskInputFocused = false;

  /**
 * Handles input changes for the new subtask title and limits its length to 20 characters.
 */
  onSubtaskInput() {
    if (this.newSubtaskTitle.length > 20) {
      this.newSubtaskTitle = this.newSubtaskTitle.substring(0, 20);
    }
  }

  /**
 * Sets the focus state when the subtask input field is focused.
 */
  onSubtaskInputFocus() {
    this.subtaskInputFocused = true;
  }

  /**
 * Handles blur event on the subtask input and resets focus state if input is empty.
 */
  onSubtaskInputBlur() {
    setTimeout(() => {
      if (!this.newSubtaskTitle) {
        this.subtaskInputFocused = false;
      }
    }, 200);
  }

  /**
 * Clears the new subtask input field and resets focus state.
 */
  clearSubtaskInput() {
    this.newSubtaskTitle = '';
    this.subtaskInputFocused = false;
  }

  /**
 * Adds a new subtask to the list if the input is not empty, trims and limits the title, emits the updated list, and clears the input.
 */
  addSubtask() {
    if (this.newSubtaskTitle.trim()) {
      const trimmedTitle = this.newSubtaskTitle.trim().substring(0, 20);
      const updatedSubtasks = [
        {
          id: Date.now().toString(),
          title: trimmedTitle,
          completed: false,
        },
        ...this.subtasks,
      ];
      this.subtasks = updatedSubtasks;
      this.subtasksChange.emit(updatedSubtasks);
      this.newSubtaskTitle = '';
    }
  }

  /**
 * Sets the editing state for a specific subtask by its ID.
 *
 * @param subtaskId - The ID of the subtask to edit.
 */
  startEditSubtask(subtaskId: string) {
    this.editingSubtaskId = subtaskId;
  }

  /**
 * Saves the edited subtask title, trims and limits it, emits the updated list, and exits editing mode.
 *
 * @param subtask - The subtask being edited.
 * @param newTitle - The new title for the subtask.
 */
  saveSubtask(subtask: Subtask, newTitle: string) {
    if (newTitle.trim()) {
      subtask.title = newTitle.trim().substring(0, 20);
      this.subtasksChange.emit([...this.subtasks]);
    }
    this.editingSubtaskId = null;
  }

  /**
 * Deletes a subtask by its ID, updates the list, and emits the change.
 *
 * @param subtaskId - The ID of the subtask to delete.
 */
  deleteSubtask(subtaskId: string) {
    const updatedSubtasks = this.subtasks.filter((s) => s.id !== subtaskId);
    this.subtasks = updatedSubtasks;
    this.subtasksChange.emit(updatedSubtasks);
  }

  /**
 * Changes the close icon to the hover image when hovered.
 *
 * @param imgElement - The image element to update.
 */
  onSubtaskCloseHover(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-hover-board.png';
  }

  /**
 * Resets the close icon to the default image when not hovered.
 *
 * @param imgElement - The image element to update.
 */
  onSubtaskCloseLeave(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/close-default-board.png';
  }

  /**
 * Changes the check icon to the hover image when hovered.
 *
 * @param imgElement - The image element to update.
 */
  onSubtaskCheckHover(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/check-dark-hover.png';
  }

  /**
 * Resets the check icon to the default image when not hovered.
 *
 * @param imgElement - The image element to update.
 */
  onSubtaskCheckLeave(imgElement: HTMLImageElement) {
    imgElement.src = 'assets/board/check-dark-default.png';
  }
}
