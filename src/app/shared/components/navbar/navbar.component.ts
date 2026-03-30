import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { selectFavoritesCount } from '../../../store/favorites/favorites.selectors';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';
import { APP_CONFIG } from '../../../core/constants/app.constants';

interface NavLink {
  label: string;
  path: string;
  exact: boolean;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  private readonly store = inject(Store);
  readonly config = APP_CONFIG;

  readonly routes = APP_ROUTES;

  readonly navLinks: NavLink[] = [
    { label: 'CHARACTERS', path: APP_ROUTES.characters, exact: true },
    { label: 'FAVORITES', path: APP_ROUTES.favorites, exact: false },
  ];

  favoritesCount = toSignal(this.store.select(selectFavoritesCount), { initialValue: 0 });
}
