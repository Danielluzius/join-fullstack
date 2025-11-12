import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-bar.html',
  styleUrl: './progress-bar.scss',
})
export class ProgressBar {
  /**
 * The current progress value (0-100).
 * 
 * @type {number}
 * @default 0
 */
  @Input() progress: number = 0;

  /**
 * The color of the progress bar.
 * 
 * @type {string}
 * @default '#4589ff'
 */
  @Input() color: string = '#4589ff';

  /**
 * The height of the progress bar. Can be 'small' or 'medium'.
 * 
 * @type {'small' | 'medium'}
 * @default 'small'
 */
  @Input() height: 'small' | 'medium' = 'small';

  
/**
 * Optional label to display alongside the progress bar.
 * 
 * @type {string | undefined}
 */
  @Input() label?: string;

  /**
 * Returns the progress value clamped between 0 and 100.
 * 
 * @returns {number} The progress percentage.
 */
  get progressPercentage(): number {
    return Math.min(Math.max(this.progress, 0), 100);
  }
}
