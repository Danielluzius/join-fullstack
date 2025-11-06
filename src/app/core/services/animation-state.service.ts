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
