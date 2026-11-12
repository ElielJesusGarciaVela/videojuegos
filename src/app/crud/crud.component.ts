import { Component, inject, Input, output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-crud',
  imports: [FormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent {
  private gameService = inject(GameService);

  game: Game = this.emptyGame();
  actualizaGames = output<Game>();
  editCancelled = output<void>();

  @ViewChild('gameForm') private gameForm?: NgForm;

  @Input()
  set editGame(game: Game | undefined) {
    this.game = game ? { ...game } : this.emptyGame();
    this.gameForm?.resetForm(this.game);
  }

  saveGame(form: NgForm) {
    if (form.invalid || form.pending) {
      return;
    }

    const request = this.game.id !== undefined
      ? this.gameService.updateGame(this.game)
      : this.gameService.postGame(this.game);

    request.subscribe(savedGame => {
      this.resetForm(form);
      this.actualizaGames.emit(savedGame);
    });
  }

  cancelEdit(form: NgForm): void {
    this.resetForm(form);
    this.editCancelled.emit();
  }

  private resetForm(form: NgForm): void {
    this.game = this.emptyGame();
    form.resetForm(this.game);
  }

  private emptyGame(): Game {
    return {
      title: '',
      genre: '',
      platform: '',
      price: 0,
      stock: 0,
    };
  }
}
