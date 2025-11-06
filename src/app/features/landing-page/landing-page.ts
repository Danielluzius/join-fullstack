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

  constructor(private animationStateService: AnimationStateService) {}

  ngOnInit(): void {
    this.showAnimation = this.animationStateService.shouldPlayAnimation();

    if (this.showAnimation) {
      // Animation dauert 2 Sekunden, dann ist sie komplett
      setTimeout(() => {
        this.animationComplete = true;
      }, 2000);
    } else {
      // Keine Animation, Logo direkt an Endposition
      this.animationComplete = true;
    }
  }
}
