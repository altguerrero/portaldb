import { Component, inject } from '@angular/core';
import { RESPONSE_INIT } from '@angular/core';
import { APP_ROUTES } from '../../../../core/constants/app-routes.constants';
import { ButtonComponent } from '../../../../shared/components/button/button.component';

@Component({
  selector: 'app-not-found-page',
  imports: [ButtonComponent],
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
