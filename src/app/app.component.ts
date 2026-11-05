import { CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GameService } from './services/game.service';
import { Game } from './models/game';
import { CrudComponent } from './crud/crud.component';

@Component({
  selector: 'app-root',
  imports: [CurrencyPipe, CrudComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'videojuegos';

  games: Game[] = [];
  gameById?: Game;
  searchError = '';
  filterError = '';
  selectedGenre = '';
  selectedPlatform = '';
  searchText = '';
  searchAll = false;
  selectedPriceMin = '';
  selectedPriceMax = '';
  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 0;

  constructor(private gameService: GameService) {}
  ngOnInit(): void {
    this.loadGames();
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

  onGenreChange(genre: string): void {
    this.selectedGenre = genre;
    this.currentPage = 1;
    this.loadGames();
  }

  onPlatformChange(platform: string): void {
    this.selectedPlatform = platform;
    this.currentPage = 1;
    this.loadGames();
  }

  onSearchGames(text: string, searchAll: boolean): void {
    this.searchText = text.trim();
    this.searchAll = searchAll;
    this.currentPage = 1;
    this.loadGames();
  }

  onPriceFilter(minimum: string, maximum: string): void {
    this.filterError = '';

    if ((minimum && Number(minimum) < 0) || (maximum && Number(maximum) < 0)) {
      this.filterError = 'Introduce precios válidos mayores o iguales a cero.';
      return;
    }

    if (
      (minimum && !Number.isFinite(Number(minimum))) ||
      (maximum && !Number.isFinite(Number(maximum)))
    ) {
      this.filterError = 'Introduce precios válidos mayores o iguales a cero.';
      return;
    }

    if (minimum && maximum && Number(minimum) > Number(maximum)) {
      this.filterError = 'El precio mínimo no puede superar al máximo.';
      return;
    }

    this.selectedPriceMin = minimum;
    this.selectedPriceMax = maximum;
    this.currentPage = 1;
    this.loadGames();
  }

  loadGames(): void {
    this.filterError = '';
    this.gameService
      .getGames(
        this.currentPage,
        this.pageSize,
        this.selectedGenre,
        this.selectedPlatform,
        this.selectedPriceMin,
        this.selectedPriceMax,
        this.searchText,
        this.searchAll,
      )
      .subscribe({
        next: (response) => {
          this.games = response.body ?? [];
          this.totalItems = Number(response.headers.get('X-Total-Count') ?? 0);
          this.totalPages = Math.ceil(this.totalItems / this.pageSize);
        },
        error: () => {
          this.filterError = 'No se pudieron cargar los videojuegos con estos filtros.';
        },
      });
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadGames();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadGames();
    }
  }
}
