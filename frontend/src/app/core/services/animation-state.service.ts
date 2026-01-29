/**
 * Service for managing the state of the logo animation.
 *
 * - Uses sessionStorage to track if the animation has already played in the current session.
 *
 * @method shouldPlayAnimation
 *   Checks if the animation should play.
 *   - Returns `true` if the animation has not played yet in this session and sets the flag.
 *   - Returns `false` if the animation has already played.
 *
 * @method resetAnimationState
 *   Resets the animation state so the animation can play again.
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AnimationStateService {
  private readonly STORAGE_KEY = 'logo-animation-played';

  shouldPlayAnimation(): boolean {
    const hasPlayed = sessionStorage.getItem(this.STORAGE_KEY);
    if (!hasPlayed) {
      sessionStorage.setItem(this.STORAGE_KEY, 'true');
      return true;
    }
    return false;
  }

  resetAnimationState(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}
