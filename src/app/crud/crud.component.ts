import { Component, inject } from '@angular/core';
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

  game: Game = {
    id: 0,
    title: '',
    genre: '',
    platform: '',
    price: 0,
    stock: 0,
  };
  
  onSaveGame(_t5: NgForm) {
    throw new Error('Method not implemented.');
  }
}
