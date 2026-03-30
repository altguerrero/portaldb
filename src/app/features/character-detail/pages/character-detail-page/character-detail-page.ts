import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, switchMap } from 'rxjs/operators';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { CharactersService } from '../../../../core/services/characters.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Character } from '../../../../shared/models/character.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { addFavorite, removeFavorite } from '../../../../store/favorites/favorites.actions';
import { selectIsFavorite } from '../../../../store/favorites/favorites.selectors';

interface CharacterDetailViewModel {
  character: Character | null;
  isFavorite: boolean;
  profileTag: string;
  registryId: string;
  statusLabel: string;
  typeLabel: string;
}

@Component({
  selector: 'app-character-detail-page',
  imports: [AsyncPipe, DatePipe, RouterLink, ButtonComponent, StatusBadgeComponent],
  templateUrl: './character-detail-page.html',
  styleUrl: './character-detail-page.css',
})
export class CharacterDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly charactersService = inject(CharactersService);
  private readonly store = inject(Store);

  readonly routes = APP_ROUTES;

  private readonly characterId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id') ?? '0')),
    map((id) => (Number.isNaN(id) || id < 1 ? 0 : id)),
    distinctUntilChanged(),
  );

  readonly vm$ = this.characterId$.pipe(
    switchMap((id) => {
      if (!id) {
        return of(this.createErrorViewModel());
      }

      return combineLatest([
        this.charactersService.getCharacterById(id),
        this.store.select(selectIsFavorite(id)),
      ]).pipe(
        map(([character, isFavorite]) => this.createViewModel(character, isFavorite)),
        catchError(() => of(this.createErrorViewModel())),
      );
    }),
  );

  toggleFavorite(character: Character, isFavorite: boolean): void {
    this.store.dispatch(
      isFavorite ? removeFavorite({ id: String(character.id) }) : addFavorite({ character }),
    );
  }

  private createViewModel(
    character: Character,
    isFavorite: boolean,
  ): CharacterDetailViewModel {
    return {
      character,
      isFavorite,
      profileTag: (character.type || character.species).trim(),
      registryId: `PX-${String(character.id).padStart(4, '0')}`,
      statusLabel: character.status === 'unknown' ? 'Unknown' : character.status,
      typeLabel: character.type.trim() || 'Unclassified Variant',
    };
  }

  private createErrorViewModel(): CharacterDetailViewModel {
    return {
      character: null,
      isFavorite: false,
      profileTag: '',
      registryId: '',
      statusLabel: '',
      typeLabel: '',
    };
  }
}
