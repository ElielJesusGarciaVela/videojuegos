import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/games';
  constructor() { }

  getGames(
    page: number,
    limit: number,
    genre: string,
    platform: string,
    minPrice: string,
    maxPrice: string,
    text: string,
    searchAll: boolean,
  ): Observable<HttpResponse<Game[]>> {
    let params = new HttpParams();
    params = params.set('_page', page);
    params = params.set('_limit', limit);

    if (genre) params = params.set('genre', genre);
    if (platform) params = params.set('platform', platform);
    if (minPrice) params = params.set('price_gte', minPrice);
    if (maxPrice) params = params.set('price_lte', maxPrice);
    if (text && searchAll) params = params.set('q', text);
    if (text && !searchAll) params = params.set('title_like', text);

    return this.http.get<Game[]>(this.apiUrl, {
      params,
      observe: 'response',
    });
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }
}