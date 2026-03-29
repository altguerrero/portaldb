import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(selectFavoritesState, (state) => state.characters);

export const selectFavoritesCount = createSelector(
  selectAllFavorites,
  (characters) => characters.length,
);

export const selectIsFavorite = (id: number) =>
  createSelector(selectAllFavorites, (characters) => characters.some((c) => c.id === id));
