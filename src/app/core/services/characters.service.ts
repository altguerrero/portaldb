import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Character, ApiResponse } from '../../shared/models/character.model';
import { environment } from '../../../environments/environment';
import { API_ROUTES } from '../constants/api-routes.constants';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCharacters(page = 1): Observable<ApiResponse<Character>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<Character>>(`${this.apiUrl}${API_ROUTES.characters.base}`, {
      params,
    });
  }

  getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}${API_ROUTES.characters.byId(id)}`);
  }
}
