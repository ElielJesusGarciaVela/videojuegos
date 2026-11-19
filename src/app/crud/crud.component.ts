import { Component, inject, Input, output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GameService } from '../services/game.service';
import { Game } from '../models/game';

@Component({
  selector: 'app-crud',
  imports: [ReactiveFormsModule],
  templateUrl: './crud.component.html',
  styleUrl: './crud.component.css',
})
export class CrudComponent {
  private gameService = inject(GameService);

  actualizaGames = output<Game>();
  editCancelled = output<void>();
  saveError = '';
  editingId?: number;

  gameForm = new FormGroup({
    title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    genre: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    platform: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    price: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.01), Validators.max(100)],
    }),
    stock: new FormControl(0, {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.min(0),
        Validators.max(999),
        Validators.pattern(/^\d+$/),
      ],
    }),
  });

  @Input()
  set editGame(game: Game | undefined) {
    this.editingId = game?.id;
    this.saveError = '';

    if (game) {
      this.gameForm.reset({
        title: game.title,
        genre: game.genre,
        platform: game.platform,
        price: game.price,
        stock: game.stock,
      });
    } else {
      this.gameForm.reset();
    }
  }

  saveGame(form: FormGroupDirective): void {
    this.saveError = '';
    this.gameForm.markAllAsTouched();

    if (this.gameForm.invalid) {
      return;
    }

    const values = this.gameForm.getRawValue();
    const game: Game = {
      ...values,
      ...(this.editingId !== undefined ? { id: this.editingId } : {}),
    };
    const request = this.editingId !== undefined
      ? this.gameService.updateGame(game)
      : this.gameService.postGame(game);

    request.subscribe({
      next: (savedGame) => {
        this.resetForm(form);
        this.actualizaGames.emit(savedGame);
      },
      error: () => {
        this.saveError = 'No se pudo guardar el videojuego. Comprueba la conexión con el servidor.';
      },
    });
  }

  cancelEdit(form: FormGroupDirective): void {
    this.resetForm(form);
    this.editCancelled.emit();
  }

  limpiar(form: FormGroupDirective): void {
    this.resetForm(form);
  }

  private resetForm(form: FormGroupDirective): void {
    this.editingId = undefined;
    this.saveError = '';
    form.resetForm();
  }
}
