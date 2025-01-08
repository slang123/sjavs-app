import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { Card, Suit } from "../models/card.model";
import { Player } from "../models/player.model";
import { computed } from '@angular/core';

type GameState = {
    deck: Card[];
    players: Player[];
    currentPlayerId: number;
    currentTrick: Card[];
}

const initialState: GameState = {
    deck: [],
    players: [],
    currentPlayerId: 0,
    currentTrick: []
}

export const GameStore = signalStore(
    withState(initialState),
    withComputed((store) => ({
        currentPlayer: computed(() => store.players()[store.currentPlayerId()])
    })),
    withMethods((store) => ({
        initializeGame() {
            patchState(store, {
                deck: createDeck(),
                players: [],
                currentPlayerId: 0,
                currentTrick: []
            })
        },
        shuffleDeck() {
            patchState(store, {
                deck: shuffle(store.deck())
            });
        },
        dealCards(playerCount: number) {
            const players: Player[] = [];
            const cardsPerPlayer = Math.floor(store.deck().length / playerCount);

            for (let i = 0; i < playerCount; i++) {
                players.push({
                    id: i,
                    name: `Player ${i + 1}`,
                    hand: store.deck().slice(i * cardsPerPlayer, (i + 1) * cardsPerPlayer),
                    points: 0,
                });
            }

            patchState(store, {
                players,
                deck: store.deck().slice(playerCount * cardsPerPlayer),
            })
        },
        playCard(playerId: number, card: Card) {
            // Remove card from the player's hand
            const players = store.players().map((p) => {
                if (p.id === playerId) {
                    return {
                        ...p,
                        hand: p.hand.filter((c) => c !== card),
                    };
                }
                return p;
            });

            // Add played card to currentTrick
            const currentTrick = [...store.currentTrick(), card];

            // Check if the trick is complete
            if (currentTrick.length === store.players().length) {
                this.completeTrick();
            }

            patchState(store, {
                players,
                currentTrick,
            });
        },
        completeTrick() {
            // Handle scoring and resetting currentTrick
            // Add your scoring logic here

            patchState(store, {
                currentTrick: []
            });
        },
        scoreRound() {

        }
    }))
)

// Stub shuffle function to keep this example self-contained:
function shuffle(deck: Card[]): Card[] {
    const result = [...deck];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

function createDeck(): Card[] {
    const suits = [Suit.Clubs, Suit.Diamonds, Suit.Hearts, Suit.Spades];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (let rank = 1; rank <= 13; rank++) {
        deck.push({ suit, rank });
      }
    }
    return deck;
  }
