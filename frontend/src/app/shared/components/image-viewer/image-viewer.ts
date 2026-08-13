import { Component, EventEmitter, Input, Output, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskAttachment } from '../../../core/interfaces/board-tasks-interface';

/**
 * Full-screen image viewer with zoom, navigation, and download.
 * Displays one image at a time from an attachments array.
 */
@Component({
  selector: 'app-image-viewer',
  imports: [CommonModule],
  templateUrl: './image-viewer.html',
  styleUrl: './image-viewer.scss',
  standalone: true,
})
export class ImageViewerComponent {
  @Input() attachments: TaskAttachment[] = [];
  @Input() startIndex = 0;
  @Output() closeViewer = new EventEmitter<void>();

  zoomLevel = 1;

  /** Returns the currently displayed attachment. */
  get current(): TaskAttachment {
    return this.attachments[this.startIndex];
  }

  /** Navigates to the next image, wrapping around at the end. */
  next(): void {
    this.startIndex = (this.startIndex + 1) % this.attachments.length;
    this.zoomLevel = 1;
  }

  /** Navigates to the previous image, wrapping around at the start. */
  prev(): void {
    this.startIndex = (this.startIndex - 1 + this.attachments.length) % this.attachments.length;
    this.zoomLevel = 1;
  }

  /** Increases zoom level up to a maximum of 3×. */
  zoomIn(): void {
    if (this.zoomLevel < 3) this.zoomLevel = Math.round((this.zoomLevel + 0.5) * 10) / 10;
  }

  /** Decreases zoom level down to a minimum of 0.5×. */
  zoomOut(): void {
    if (this.zoomLevel > 0.5) this.zoomLevel = Math.round((this.zoomLevel - 0.5) * 10) / 10;
  }

  /** Triggers a file download for the current attachment. */
  download(): void {
    const link = document.createElement('a');
    link.href = this.current.base64;
    link.download = this.current.name;
    link.click();
  }

  /** Formats a byte count to a human-readable KB or MB string. */
  formatSize(bytes: number): string {
    if (bytes < 1_048_576) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1_048_576).toFixed(1)} MB`;
  }

  /** Closes the viewer on Escape key press. */
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeViewer.emit();
  }

  /** Navigates with arrow keys for keyboard accessibility. */
  @HostListener('document:keydown.arrowRight')
  onArrowRight(): void {
    if (this.attachments.length > 1) this.next();
  }

  /** Navigates with arrow keys for keyboard accessibility. */
  @HostListener('document:keydown.arrowLeft')
  onArrowLeft(): void {
    if (this.attachments.length > 1) this.prev();
  }
}
