import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-character-detail-page',
  imports: [RouterLink],
  templateUrl: './character-detail-page.html',
  styleUrl: './character-detail-page.css',
})
export class CharacterDetailPage {
  readonly routes = APP_ROUTES;
}
