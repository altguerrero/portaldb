import { createReducer, on } from '@ngrx/store';
import { Character } from '../../shared/models/character.model';
import { addFavorite, removeFavorite, loadFavoritesFromStorageSuccess } from './favorites.actions';

export interface FavoritesState {
  characters: Character[];
}

export const initialState: FavoritesState = {
  characters: [],
};

export const favoritesReducer = createReducer(
  initialState,

  on(loadFavoritesFromStorageSuccess, (_, { characters }) => ({
    characters,
  })),

  on(addFavorite, (state, { character }) => {
    const exists = state.characters.some((c) => c.id === character.id);

    return exists
      ? state
      : {
          ...state,
          characters: [...state.characters, character],
        };
  }),

  on(removeFavorite, (state, { id }) => ({
    ...state,
    characters: state.characters.filter((c) => c.id !== Number(id)),
  })),
);
