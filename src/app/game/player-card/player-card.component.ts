import { Component, inject, input } from '@angular/core';
import { Card } from '../../models/card.model';
import { GameStore } from '../game.store';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-player-card',
  imports: [CardComponent],
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss'
})
export class PlayerCardComponent {
  store = inject(GameStore);
  playerId = input.required<number>();
  hand = input.required<Card[]>();
  isPlayable: boolean = false;

  onCardClick(card: Card) {
    if (this.isPlayable) {
      this.store.playCard(this.playerId(), card);
    }
  }
}
