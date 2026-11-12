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

  getGamesBasic(genre: string = '', platform: string = '') {
    let params = new HttpParams();

    if (genre) {
      params = params.set('genre', genre);
    }

    if (platform) {
      params = params.set('platform', platform);
    }

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  getGameById(id: number): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${id}`);
  }

  searchGames(text: string) {
    const params = new HttpParams().set('title_like', text);

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  searchGlobal(text: string) {
    const params = new HttpParams().set('q', text);

    return this.http.get<Game[]>(this.apiUrl, { params });
  }

  getGamePriceMin(price_gte: number) {
    return this.http.get<Game[]>(`${this.apiUrl}?price_gte=${price_gte}`);
  }

  getGamePriceMax(price_lte: number) {
    return this.http.get<Game[]>(`${this.apiUrl}?price_lte=${price_lte}`);
  }

  getGamePrice(price_gte: number, price_lte: number) {
    return this.http.get<Game[]>(`${this.apiUrl}?price_gte=${price_gte}&price_lte=${price_lte}`);
  }

  postGame(game: Game): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, game);
  }

  putGame(game: Game): Observable<Game> {
    return this.updateGame(game);
  }

  getGamesPage(
    page: number,
    limit: number,
    genre: string,
    platform: string,
    title: string,
    global: string,
    minPrice: number,
    maxPrice: number,
  ) {
    let params = new HttpParams()
      .set('_page', page)
      .set('_limit', limit);

    if (genre) params = params.set('genre', genre);
    if (platform) params = params.set('platform', platform);
    if (title) params = params.set('title_like', title);
    if (global) params = params.set('q', global);
    if (minPrice > 0) params = params.set('price_gte', minPrice);
    if (maxPrice > 0) params = params.set('price_lte', maxPrice);

    return this.http.get<Game[]>(this.apiUrl, {
      params,
      observe: 'response'
    });
  }

  updateGame(game: Game): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/${game.id}`, game);
  }
}