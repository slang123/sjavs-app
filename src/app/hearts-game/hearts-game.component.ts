import { Component, inject } from '@angular/core';
import { GameTableComponent } from '../game/game-table/game-table.component';
import { PlayerCardComponent } from '../game/player-card/player-card.component';
import { GameStore } from '../game/game.store';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-hearts-game',
  imports: [GameTableComponent, PlayerCardComponent, MatToolbarModule, MatButtonModule
  ],
  templateUrl: './hearts-game.component.html',
  styleUrl: './hearts-game.component.scss',
  providers: [GameStore]
})
export class HeartsGameComponent {
  store = inject(GameStore);

  dealCards() {
    this.store.dealCards(4);
  }

  shuffleDeck() {
    this.store.shuffleDeck();
  }

  initialize() {
    this.store.initializeGame();
    this.store.shuffleDeck();
    this.store.dealCards(4);
  }

}
