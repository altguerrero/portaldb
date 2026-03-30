import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import {
  addFavorite,
  loadFavoritesFromStorage,
  loadFavoritesFromStorageSuccess,
  removeFavorite,
} from './favorites.actions';
import { selectAllFavorites } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly storageKey = 'portaldb_favorites';

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavoritesFromStorage),
      map(() => {
        if (!isPlatformBrowser(this.platformId)) {
          return loadFavoritesFromStorageSuccess({ characters: [] });
        }

        try {
          const stored = localStorage.getItem(this.storageKey);

          return loadFavoritesFromStorageSuccess({
            characters: stored ? JSON.parse(stored) : [],
          });
        } catch {
          return loadFavoritesFromStorageSuccess({ characters: [] });
        }
      }),
    ),
  );

  saveFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addFavorite, removeFavorite),
        withLatestFrom(this.store.select(selectAllFavorites)),
        tap(([, favorites]) => {
          if (!isPlatformBrowser(this.platformId)) {
            return;
          }

          localStorage.setItem(this.storageKey, JSON.stringify(favorites));
        }),
      ),
    { dispatch: false },
  );
}
