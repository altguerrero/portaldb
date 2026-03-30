import { Component, inject } from '@angular/core';
import { RESPONSE_INIT } from '@angular/core';
import { RouterLink } from '@angular/router';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  templateUrl: './not-found-page.html',
  styleUrl: './not-found-page.css',
})
export class NotFoundPage {
  private readonly responseInit = inject(RESPONSE_INIT, { optional: true });

  readonly routes = APP_ROUTES;

  constructor() {
    if (this.responseInit) {
      this.responseInit.status = 404;
    }
  }
}
