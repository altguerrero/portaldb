import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { BehaviorSubject, firstValueFrom, ReplaySubject } from 'rxjs';

import { createCharacter } from '../../../testing/character.fixture';
import {
  addFavorite,
  loadFavoritesFromStorage,
  loadFavoritesFromStorageSuccess,
} from './favorites.actions';
import { FavoritesEffects } from './favorites.effects';

describe('FavoritesEffects', () => {
  afterEach(() => {
    TestBed.resetTestingModule();
    localStorage.clear();
    vi.restoreAllMocks();
  });

  function setup(platformId: string = 'browser', favorites = [createCharacter()]) {
    const actions$ = new ReplaySubject<Action>(1);
    const favorites$ = new BehaviorSubject(favorites);
    const store = {
      select: vi.fn(() => favorites$.asObservable()),
    };

    TestBed.configureTestingModule({
      providers: [
        FavoritesEffects,
        { provide: Actions, useValue: new Actions(actions$) },
        { provide: Store, useValue: store },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });

    return {
      actions$,
      favorites$,
      store,
      effects: TestBed.inject(FavoritesEffects),
    };
  }

  it('should load favorites from localStorage in the browser', async () => {
    const storedFavorites = [createCharacter(), createCharacter({ id: 2, name: 'Morty Smith' })];
    localStorage.setItem('portaldb_favorites', JSON.stringify(storedFavorites));

    const { actions$, effects } = setup();
    const resultPromise = firstValueFrom(effects.loadFavorites$);

    actions$.next(loadFavoritesFromStorage());

    await expect(resultPromise).resolves.toEqual(
      loadFavoritesFromStorageSuccess({ characters: storedFavorites }),
    );
  });

  it('should fall back to an empty list when storage is invalid', async () => {
    localStorage.setItem('portaldb_favorites', '{invalid-json');

    const { actions$, effects } = setup();
    const resultPromise = firstValueFrom(effects.loadFavorites$);

    actions$.next(loadFavoritesFromStorage());

    await expect(resultPromise).resolves.toEqual(
      loadFavoritesFromStorageSuccess({ characters: [] }),
    );
  });

  it('should skip localStorage reads on the server', async () => {
    const { actions$, effects } = setup('server');
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
    const resultPromise = firstValueFrom(effects.loadFavorites$);

    actions$.next(loadFavoritesFromStorage());

    await expect(resultPromise).resolves.toEqual(
      loadFavoritesFromStorageSuccess({ characters: [] }),
    );
    expect(getItemSpy).not.toHaveBeenCalled();
  });

  it('should persist favorites after favorite changes in the browser', () => {
    const favorites = [createCharacter({ id: 4, name: 'Beth Smith' })];
    const { actions$, effects } = setup('browser', favorites);
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const subscription = effects.saveFavorites$.subscribe();

    actions$.next(addFavorite({ character: favorites[0] }));

    expect(setItemSpy).toHaveBeenCalledWith('portaldb_favorites', JSON.stringify(favorites));

    subscription.unsubscribe();
  });

  it('should not persist favorites on the server', () => {
    const { actions$, effects } = setup('server');
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
    const subscription = effects.saveFavorites$.subscribe();

    actions$.next(addFavorite({ character: createCharacter() }));

    expect(setItemSpy).not.toHaveBeenCalled();

    subscription.unsubscribe();
  });
});
