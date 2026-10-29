import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { Game } from './models/game';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'videojuegos';

  games: Game[] = [];
  gameById?: Game;
  searchError = '';

  constructor(private gameService: GameService) {}
  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => {
      this.games = games;
      console.log(games);
    });
  }

  onBuscarId(id: string): void {
    const gameId = Number(id);
    this.gameById = undefined;
    this.searchError = '';

    if (!Number.isInteger(gameId) || gameId < 1) {
      this.searchError = 'Enter a valid game ID.';
      return;
    }

    this.gameService.getGameById(gameId).subscribe({
      next: (game) => {
        this.gameById = game;
      },
      error: () => {
        this.searchError = `Could not find a game with ID ${gameId}.`;
      },
    });
  }

  onGenreChange($event: Event) {
    const select = event!.target as HTMLSelectElement;
    const genre = select.value;
    console.log(genre);
  }
}
