import {
  selectAllFavorites,
  selectFavoritesCount,
  selectIsFavorite,
} from './favorites.selectors';
import { createCharacter } from '../../../testing/character.fixture';

describe('favorites selectors', () => {
  const firstFavorite = createCharacter();
  const secondFavorite = createCharacter({ id: 2, name: 'Morty Smith' });
  const state = {
    favorites: {
      characters: [firstFavorite, secondFavorite],
    },
  };

  it('should select all favorites', () => {
    expect(selectAllFavorites(state)).toEqual([firstFavorite, secondFavorite]);
  });

  it('should derive the favorites count', () => {
    expect(selectFavoritesCount(state)).toBe(2);
  });

  it('should tell whether a character id is favorited', () => {
    expect(selectIsFavorite(2)(state)).toBe(true);
    expect(selectIsFavorite(99)(state)).toBe(false);
  });
});
