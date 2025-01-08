// card.model.ts
export enum Suit {
    Clubs = '♣',
    Diamonds = '♦',
    Hearts = '♥',
    Spades = '♠',
  }
  
  export interface Card {
    suit: Suit;
    rank: number;  // 1 = Ace, 11 = Jack, 12 = Queen, 13 = King
  }
  