import { addFavorite, loadFavoritesFromStorageSuccess, removeFavorite } from './favorites.actions';
import { favoritesReducer, initialState } from './favorites.reducer';
import { createCharacter } from '../../../testing/character.fixture';

describe('favoritesReducer', () => {
  it('should hydrate state from storage', () => {
    const characters = [createCharacter(), createCharacter({ id: 2, name: 'Morty Smith' })];

    const state = favoritesReducer(initialState, loadFavoritesFromStorageSuccess({ characters }));

    expect(state).toEqual({ characters });
  });

  it('should append a new favorite when it does not exist yet', () => {
    const character = createCharacter();

    const state = favoritesReducer(initialState, addFavorite({ character }));

    expect(state.characters).toEqual([character]);
  });

  it('should ignore duplicate favorites by id', () => {
    const character = createCharacter();
    const stateWithFavorite = { characters: [character] };

    const state = favoritesReducer(stateWithFavorite, addFavorite({ character }));

    expect(state).toBe(stateWithFavorite);
  });

  it('should remove favorites using the action id payload', () => {
    const keptCharacter = createCharacter();
    const removedCharacter = createCharacter({ id: 2, name: 'Morty Smith' });

    const state = favoritesReducer(
      { characters: [keptCharacter, removedCharacter] },
      removeFavorite({ id: '2' }),
    );

    expect(state.characters).toEqual([keptCharacter]);
  });
});
