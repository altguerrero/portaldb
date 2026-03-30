import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { Character } from '../../../../shared/models/character.model';
import { removeFavorite } from '../../../../store/favorites/favorites.actions';
import { selectAllFavorites } from '../../../../store/favorites/favorites.selectors';

interface FavoriteCharacterViewModel {
  character: Character;
  registryId: string;
}

interface FavoritesPageViewModel {
  favorites: FavoriteCharacterViewModel[];
  totalFavorites: number;
  aliveCount: number;
  uniqueOrigins: number;
}

@Component({
  selector: 'app-favorites-page',
  imports: [AsyncPipe, RouterLink, ButtonComponent, StatusBadgeComponent],
  templateUrl: './favorites-page.html',
  styleUrl: './favorites-page.css',
})
export class FavoritesPage {
  private readonly store = inject(Store);

  readonly routes = APP_ROUTES;

  readonly vm$ = this.store.select(selectAllFavorites).pipe(
    map((favorites) => this.createViewModel(favorites)),
  );

  removeFavorite(characterId: number): void {
    this.store.dispatch(removeFavorite({ id: String(characterId) }));
  }

  private createViewModel(favorites: Character[]): FavoritesPageViewModel {
    const uniqueOrigins = new Set(favorites.map((character) => character.origin.name)).size;
    const favoriteItems = favorites.map((character) => ({
      character,
      registryId: `PX-${String(character.id).padStart(4, '0')}`,
    }));

    return {
      favorites: favoriteItems,
      totalFavorites: favorites.length,
      aliveCount: favorites.filter((character) => character.status === 'Alive').length,
      uniqueOrigins,
    };
  }
}
