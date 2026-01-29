import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {

  /**
 * The initials to display inside the avatar.
 * 
 * @type {string}
 * @default ''
 */
  @Input() initials: string = '';

  /**
 * The background color of the avatar circle.
 * 
 * @type {string}
 * @default '#2A3647'
 */
  @Input() backgroundColor: string = '#2A3647';

  /**
 * The size of the avatar. Can be 'small', 'medium', or 'large'.
 * 
 * @type {'small' | 'medium' | 'large'}
 * @default 'medium'
 */
  @Input() size: 'small' | 'medium' | 'large' = 'medium';

  /**
 * The full name of the user, used for accessibility (e.g., as an aria-label or tooltip).
 * 
 * @type {string | undefined}
 */
  @Input() name?: string;
}
