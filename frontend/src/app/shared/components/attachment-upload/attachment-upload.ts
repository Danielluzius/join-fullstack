import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskAttachment } from '../../../core/interfaces/board-tasks-interface';
import {
  validateAttachment,
  validateTotalSize,
  compressAndEncode,
} from '../../../core/utils/attachment-utils';

/**
 * Reusable attachment upload component.
 * Supports drag & drop, file browsing, thumbnail preview,
 * and per-file or bulk removal.
 */
@Component({
  selector: 'app-attachment-upload',
  imports: [CommonModule],
  templateUrl: './attachment-upload.html',
  styleUrl: './attachment-upload.scss',
  standalone: true,
})
export class AttachmentUploadComponent {
  @Input() attachments: TaskAttachment[] = [];
  @Output() attachmentsChange = new EventEmitter<TaskAttachment[]>();

  isDragOver = false;
  errorMessage = '';
  isProcessing = false;

  /** Marks the drop zone as active and prevents default drag behavior. */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  /** Resets the drag-over state when the cursor leaves the drop zone. */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
  }

  /** Handles dropped files and forwards them to processFiles. */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files?.length) this.processFiles(Array.from(files));
  }

  /** Handles file selection via the hidden file input. */
  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.processFiles(Array.from(input.files));
    input.value = '';
  }

  /** Validates, compresses and appends each file to the attachments list. */
  async processFiles(files: File[]): Promise<void> {
    this.isProcessing = true;
    for (const file of files) {
      const validationError = validateAttachment(file, this.attachments);
      if (validationError) {
        this.showError(validationError);
        break;
      }
      const attachment = await compressAndEncode(file);
      const updated = [...this.attachments, attachment];
      const sizeError = validateTotalSize(updated);
      if (sizeError) {
        this.showError(sizeError);
        break;
      }
      this.attachments = updated;
      this.attachmentsChange.emit(this.attachments);
      this.errorMessage = '';
    }
    this.isProcessing = false;
  }

  /** Removes a single attachment at the given index. */
  removeAttachment(index: number): void {
    this.attachments = this.attachments.filter((_, i) => i !== index);
    this.attachmentsChange.emit(this.attachments);
  }

  /** Clears all attachments from the list. */
  removeAll(): void {
    this.attachments = [];
    this.attachmentsChange.emit(this.attachments);
  }

  /** Displays an error message and auto-dismisses it after 4 seconds. */
  private showError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => (this.errorMessage = ''), 4000);
  }

  /** Converts a byte count to a human-readable KB or MB string. */
  formatSize(bytes: number): string {
    if (bytes < 1_048_576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1_048_576).toFixed(1)} MB`;
  }
}
