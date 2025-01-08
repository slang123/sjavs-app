import { Card } from "./card.model";

// player.model.ts
export interface Player {
    id: number;
    name: string;
    hand: Card[];
    points: number;
  }
  