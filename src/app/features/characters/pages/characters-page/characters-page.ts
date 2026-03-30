import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';

import { CharactersService } from '../../../../core/services/characters.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { CharacterCardComponent } from '../../../../shared/components/character-card/character-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { Character } from '../../../../shared/models/character.model';

type CharactersPageState = 'loading' | 'ready' | 'empty' | 'error';

interface CharactersPageViewModel {
  state: CharactersPageState;
  page: number;
  totalPages: number;
  totalCount: number;
  characters: Character[];
  introText: string;
}

@Component({
  selector: 'app-characters-page',
  imports: [AsyncPipe, ButtonComponent, CharacterCardComponent, PaginationComponent],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.css',
})
export class CharactersPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly charactersService = inject(CharactersService);
  private readonly pageTop = viewChild.required<ElementRef<HTMLElement>>('pageTop');
  private readonly retry$ = new Subject<void>();

  readonly skeletonCards = Array.from({ length: 8 }, (_, index) => index);

  readonly page$ = this.route.queryParamMap.pipe(
    map((params) => Number(params.get('page') ?? '1')),
    map((page) => (Number.isNaN(page) || page < 1 ? 1 : page)),
    distinctUntilChanged(),
  );

  readonly vm$ = this.page$.pipe(
    switchMap((page) =>
      this.retry$.pipe(
        startWith(void 0),
        switchMap(() =>
          this.charactersService.getCharacters(page).pipe(
            map((response) =>
              this.createViewModel(
                page,
                response.results,
                response.info.pages,
                response.info.count,
              ),
            ),
            catchError(() => [this.createErrorViewModel(page)]),
            startWith(this.createLoadingViewModel(page)),
          ),
        ),
      ),
    ),
  );

  goToPage(targetPage: number, totalPages: number): void {
    const safeTargetPage = Math.min(Math.max(targetPage, 1), totalPages);

    void this.router
      .navigate([], {
        relativeTo: this.route,
        queryParams: { page: safeTargetPage === 1 ? null : safeTargetPage },
        queryParamsHandling: 'merge',
      })
      .then((didNavigate) => {
        if (didNavigate) {
          this.scrollToResultsTop();
        }
      });
  }

  retryPage(): void {
    this.retry$.next();
  }

  private scrollToResultsTop(): void {
    this.pageTop().nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private createLoadingViewModel(page: number): CharactersPageViewModel {
    return {
      state: 'loading',
      page,
      totalPages: 1,
      totalCount: 0,
      characters: [],
      introText: 'Synchronizing the registry feed and preparing the next character batch.',
    };
  }

  private createViewModel(
    page: number,
    characters: Character[],
    totalPages: number,
    totalCount: number,
  ): CharactersPageViewModel {
    const safeTotalPages = Math.max(totalPages, 1);
    const safePage = Math.min(page, safeTotalPages);
    const hasCharacters = characters.length > 0;

    return {
      state: hasCharacters ? 'ready' : 'empty',
      page: safePage,
      totalPages: safeTotalPages,
      totalCount,
      characters,
      introText: hasCharacters
        ? `Accessing biological data from ${totalCount} confirmed multiversal entities.`
        : 'The registry is online, but there are no records available for this query yet.',
    };
  }

  private createErrorViewModel(page: number): CharactersPageViewModel {
    return {
      state: 'error',
      page,
      totalPages: 1,
      totalCount: 0,
      characters: [],
      introText:
        'The uplink to the multiversal registry is unstable. Retry the scan to recover the feed.',
    };
  }
}
