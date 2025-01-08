import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeartsGameComponent } from './hearts-game/hearts-game.component';

@Component({
  selector: 'app-root',
  imports: [HeartsGameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'sjavs-app';
}
