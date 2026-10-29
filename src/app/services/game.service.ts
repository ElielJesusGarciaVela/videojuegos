import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3001/games';
  constructor() { }

  getGames(): Observable<Game[]>{
    return this.http.get<Game[]>(this.apiUrl)
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }
}
