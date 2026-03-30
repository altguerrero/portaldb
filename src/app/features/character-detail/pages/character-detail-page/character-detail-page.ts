import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { combineLatest, of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { CharactersService } from '../../../../core/services/characters.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Character } from '../../../../shared/models/character.model';
import { StatusBadgeComponent } from '../../../../shared/components/status-badge/status-badge.component';
import { addFavorite, removeFavorite } from '../../../../store/favorites/favorites.actions';
import { selectIsFavorite } from '../../../../store/favorites/favorites.selectors';

type CharacterDetailState = 'loading' | 'ready' | 'error';

interface CharacterDetailViewModel {
  state: CharacterDetailState;
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
  private readonly retry$ = new Subject<void>();

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

      return this.retry$.pipe(
        startWith(void 0),
        switchMap(() =>
          combineLatest([
            this.charactersService.getCharacterById(id),
            this.store.select(selectIsFavorite(id)),
          ]).pipe(
            map(([character, isFavorite]) => this.createViewModel(character, isFavorite)),
            catchError(() => of(this.createErrorViewModel())),
            startWith(this.createLoadingViewModel()),
          ),
        ),
      );
    }),
  );

  toggleFavorite(character: Character, isFavorite: boolean): void {
    this.store.dispatch(
      isFavorite ? removeFavorite({ id: String(character.id) }) : addFavorite({ character }),
    );
  }

  retry(): void {
    this.retry$.next();
  }

  private createViewModel(character: Character, isFavorite: boolean): CharacterDetailViewModel {
    return {
      state: 'ready',
      character,
      isFavorite,
      profileTag: (character.type || character.species).trim(),
      registryId: `PX-${String(character.id).padStart(4, '0')}`,
      statusLabel: character.status === 'unknown' ? 'Unknown' : character.status,
      typeLabel: character.type.trim() || 'Unclassified Variant',
    };
  }

  private createLoadingViewModel(): CharacterDetailViewModel {
    return {
      state: 'loading',
      character: null,
      isFavorite: false,
      profileTag: '',
      registryId: '',
      statusLabel: '',
      typeLabel: '',
    };
  }

  private createErrorViewModel(): CharacterDetailViewModel {
    return {
      state: 'error',
      character: null,
      isFavorite: false,
      profileTag: '',
      registryId: '',
      statusLabel: '',
      typeLabel: '',
    };
  }
}
