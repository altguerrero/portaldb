import { createAction, props } from '@ngrx/store';
import { Character } from '../../shared/models/character.model';

export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ character: Character }>(),
);

export const removeFavorite = createAction('[Favorites] Remove Favorite', props<{ id: string }>());

export const loadFavoritesFromStorage = createAction('[Favorites] Load Favorites From Storage');

export const loadFavoritesFromStorageSuccess = createAction(
  '[Favorites] Load Favorites From Storage Success',
  props<{ characters: Character[] }>(),
);
