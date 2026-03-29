import { createReducer, on } from '@ngrx/store';
import { Character } from '../../shared/models/character.model';
import { addFavorite, removeFavorite, loadFavoritesFromStorage } from './favorites.actions';

export interface FavoritesState {
  characters: Character[];
}

export const initialState: FavoritesState = {
  characters: [],
};

export const favoritesReducer = createReducer(
  initialState,

  on(loadFavoritesFromStorage, () => {
    try {
      const stored = localStorage.getItem('portaldb_favorites');
      return {
        characters: stored ? JSON.parse(stored) : [],
      };
    } catch {
      return initialState;
    }
  }),

  on(addFavorite, (state, { character }) => ({
    ...state,
    characters: [...state.characters, character],
  })),

  on(removeFavorite, (state, { id }) => ({
    ...state,
    characters: state.characters.filter((c) => c.id === Number(id)),
  })),
);
