import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { CharactersService } from '../../../../core/services/characters.service';
import { CharacterCardComponent } from '../../../../shared/components/character-card/character-card.component';
import { PaginationComponent } from '../../../../shared/components/pagination/pagination.component';
import { ApiResponse, Character } from '../../../../shared/models/character.model';

interface CharactersPageViewModel {
  page: number;
  response: ApiResponse<Character>;
}

@Component({
  selector: 'app-characters-page',
  imports: [AsyncPipe, CharacterCardComponent, PaginationComponent],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.css',
})
export class CharactersPage {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly charactersService = inject(CharactersService);
  private readonly pageTop = viewChild.required<ElementRef<HTMLElement>>('pageTop');

  readonly page$ = this.route.queryParamMap.pipe(
    map((params) => Number(params.get('page') ?? '1')),
    map((page) => (Number.isNaN(page) || page < 1 ? 1 : page)),
    distinctUntilChanged(),
  );

  readonly vm$ = this.page$.pipe(
    switchMap((page) =>
      this.charactersService
        .getCharacters(page)
        .pipe(map((response) => this.createViewModel(page, response))),
    ),
  );

  goToPage(targetPage: number, totalPages: number): void {
    const safeTargetPage = Math.min(Math.max(targetPage, 1), totalPages);

    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: safeTargetPage === 1 ? null : safeTargetPage },
      queryParamsHandling: 'merge',
    }).then((didNavigate) => {
      if (didNavigate) {
        this.scrollToResultsTop();
      }
    });
  }

  private scrollToResultsTop(): void {
    this.pageTop().nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private createViewModel(
    page: number,
    response: ApiResponse<Character>,
  ): CharactersPageViewModel {
    const safePage = Math.min(page, response.info.pages);

    return {
      page: safePage,
      response,
    };
  }
}
