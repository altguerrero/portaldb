import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { tap, withLatestFrom } from 'rxjs/operators';
import { addFavorite, removeFavorite } from './favorites.actions';
import { selectAllFavorites } from './favorites.selectors';

@Injectable()
export class FavoritesEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);

  saveFavorites$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addFavorite, removeFavorite),
        withLatestFrom(this.store.select(selectAllFavorites)),
        tap(([, favorites]) => {
          localStorage.setItem('portaldb_favorites', JSON.stringify(favorites));
        }),
      ),
    { dispatch: false },
  );
}
