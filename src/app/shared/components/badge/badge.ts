import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {

  /**
 * The text to display inside the badge.
 * 
 * @type {string}
 * @default ''
 */
  @Input() text: string = '';

  /**
 * The visual variant of the badge. Can be 'user-story', 'technical-task', or 'default'.
 * 
 * @type {'user-story' | 'technical-task' | 'default'}
 * @default 'default'
 */
  @Input() variant: 'user-story' | 'technical-task' | 'default' = 'default';
}
