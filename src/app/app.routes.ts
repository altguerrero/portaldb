import { Routes } from '@angular/router';
import { APP_ROUTES } from './core/constants/app-routes.constants';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: APP_ROUTES.characters.slice(1),
  },
  {
    path: APP_ROUTES.characters.slice(1),
    loadComponent: () =>
      import('./features/characters/pages/characters-page/characters-page').then(
        (m) => m.CharactersPage,
      ),
  },
  {
    path: `${APP_ROUTES.characters.slice(1)}/:id`,
    loadComponent: () =>
      import('./features/character-detail/pages/character-detail-page/character-detail-page').then(
        (m) => m.CharacterDetailPage,
      ),
  },
  {
    path: APP_ROUTES.favorites.slice(1),
    loadComponent: () =>
      import('./features/favorites/pages/favorites-page/favorites-page').then(
        (m) => m.FavoritesPage,
      ),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./features/not-found/pages/not-found-page/not-found-page').then(
        (m) => m.NotFoundPage,
      ),
  },
];
