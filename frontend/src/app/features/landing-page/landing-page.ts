import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AnimationStateService } from '../../core/services/animation-state.service';

@Component({
  selector: 'app-landing-page',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.scss',
})
export class LandingPage implements OnInit {
  showAnimation = false;
  animationComplete = false;

  /**
 * Constructs the LandingPage component and injects the AnimationStateService.
 *
 * @param animationStateService - Service to manage the animation state.
 */
  constructor(private animationStateService: AnimationStateService) {}

  /**
 * Lifecycle hook that is called after component initialization.
 * Determines whether the landing animation should play and handles its timing.
 */
  ngOnInit(): void {
    this.showAnimation = this.animationStateService.shouldPlayAnimation();
    if (this.showAnimation) {
      setTimeout(() => {
        this.animationComplete = true;
      }, 2000);
    } else {
      this.animationComplete = true;
    }
  }
}
