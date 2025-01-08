// models/card.model.ts
export enum Suit {
    Hearts = 'hearts',
    Diamonds = 'diamonds',
    Clubs = 'clubs',
    Spades = 'spades'
}

export class Card {
    constructor(
        public suit: Suit,
        public value: number,
        public played: boolean = false
    ) { }

    get display(): string {
        const valueMap: { [key: number]: string } = {
            11: 'J',
            12: 'Q',
            13: 'K',
            14: 'A'
        };
        return valueMap[this.value] || this.value.toString();
    }

    get points(): number {
        return this.suit === Suit.Hearts ? 1 :
            (this.suit === Suit.Spades && this.value === 12) ? 13 : 0;
    }
}

// models/player.model.ts
export class Player {
    constructor(
        public id: number,
        public name: string,
        public hand: Card[] = [],
        public tricks: Card[][] = [],
        public score: number = 0
    ) { }

    addCard(card: Card) {
        this.hand.push(card);
        this.sortHand();
    }

    removeCard(card: Card) {
        const index = this.hand.findIndex(c =>
            c.suit === card.suit && c.value === card.value
        );
        if (index !== -1) {
            this.hand.splice(index, 1);
        }
    }

    private sortHand() {
        this.hand.sort((a, b) => {
            if (a.suit !== b.suit) {
                return Object.values(Suit).indexOf(a.suit) - Object.values(Suit).indexOf(b.suit);
            }
            return a.value - b.value;
        });
    }
}

// services/game.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class GameService {
    private readonly deck: Card[] = [];
    private players: Player[] = [];
    private currentTrick: Card[] = [];
    private currentPlayerIndex = 0;
    private heartsBroken = false;

    gameState$ = new BehaviorSubject<{
        players: Player[];
        currentTrick: Card[];
        currentPlayer: Player;
        gameOver: boolean;
    } | null>(null);

    constructor() {
        this.initializeDeck();
        this.initializePlayers();
    }

    private initializeDeck() {
        Object.values(Suit).forEach(suit => {
            for (let value = 2; value <= 14; value++) {
                this.deck.push(new Card(suit, value));
            }
        });
    }

    private initializePlayers() {
        for (let i = 0; i < 4; i++) {
            this.players.push(new Player(i, `Player ${i + 1}`));
        }
    }

    dealCards() {
        this.shuffleDeck();
        let cardIndex = 0;
        while (cardIndex < this.deck.length) {
            for (const player of this.players) {
                if (cardIndex < this.deck.length) {
                    player.addCard(this.deck[cardIndex]);
                    cardIndex++;
                }
            }
        }
        this.updateGameState();
    }

    private shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    playCard(playerId: number, card: Card): boolean {
        const player = this.players[playerId];
        if (!this.isValidPlay(player, card)) {
            return false;
        }

        player.removeCard(card);
        this.currentTrick.push(card);

        if (this.currentTrick.length === 4) {
            this.resolveTrick();
        } else {
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % 4;
        }

        this.updateGameState();
        return true;
    }

    private isValidPlay(player: Player, card: Card): boolean {
        // First trick rules
        if (this.currentTrick.length === 0 && player.tricks.length === 0) {
            return card.suit === Suit.Clubs && card.value === 2;
        }

        // Follow suit if possible
        if (this.currentTrick.length > 0) {
            const leadSuit = this.currentTrick[0].suit;
            if (player.hand.some(c => c.suit === leadSuit)) {
                return card.suit === leadSuit;
            }
        }

        // Hearts cannot be led until broken
        if (this.currentTrick.length === 0 && !this.heartsBroken && card.suit === Suit.Hearts) {
            return false;
        }

        return true;
    }

    private resolveTrick() {
        const leadSuit = this.currentTrick[0].suit;
        let winningCard = this.currentTrick[0];
        let winningIndex = 0;

        for (let i = 1; i < this.currentTrick.length; i++) {
            const card = this.currentTrick[i];
            if (card.suit === leadSuit && card.value > winningCard.value) {
                winningCard = card;
                winningIndex = i;
            }
        }

        const winningPlayer = this.players[(this.currentPlayerIndex + winningIndex) % 4];
        winningPlayer.tricks.push([...this.currentTrick]);
        this.currentPlayerIndex = (this.currentPlayerIndex + winningIndex) % 4;
        this.currentTrick = [];

        // Check if hearts are broken
        if (!this.heartsBroken) {
            this.heartsBroken = this.currentTrick.some(card => card.suit === Suit.Hearts);
        }
    }

    private updateGameState() {
        this.gameState$.next({
            players: [...this.players],
            currentTrick: [...this.currentTrick],
            currentPlayer: this.players[this.currentPlayerIndex],
            gameOver: this.isGameOver()
        });
    }

    private isGameOver(): boolean {
        return this.players.some(player => player.hand.length === 0);
    }
}