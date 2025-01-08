import { Component, inject, OnInit } from '@angular/core';
import { GameStore } from '../game.store';

@Component({
  selector: 'app-game-table',
  imports: [],
  templateUrl: './game-table.component.html',
  styleUrl: './game-table.component.scss'
})
export class GameTableComponent implements OnInit {
  store = inject(GameStore);
  

  ngOnInit() {
  }
}
