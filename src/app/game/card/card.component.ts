import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Card, Suit } from '../../models/card.model';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardComponent {

  playable = input<boolean>(false);
  card = input.required<Card>();
  suitColor = computed(() => this.getSuitColor(this.card().suit));

  getSuitColor(suit: Suit): any {
    switch (suit) {
      case Suit.Clubs:
      case Suit.Spades:
        return 'text-black';
      case Suit.Diamonds:
      case Suit.Hearts:
        return 'text-red-500';
    }
  }

  getRankSymbol(rank: number): string {
    switch (rank) {
      case 1: return 'A';
      case 11: return 'J';
      case 12: return 'Q';
      case 13: return 'K';
      default: return rank.toString();
    }
  }
}
