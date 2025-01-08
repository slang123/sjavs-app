// deck.service.ts
import { Injectable } from '@angular/core';
import { Card, Suit } from '../models/card.model';

@Injectable({ providedIn: 'root' })
export class DeckService {
    
  createDeck(): Card[] {
    const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }

  shuffleDeck(deck: Card[]): Card[] {
    const result = [...deck];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}
