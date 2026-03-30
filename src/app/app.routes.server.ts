import { RenderMode, ServerRoute } from '@angular/ssr';
import { APP_ROUTES } from './core/constants/app-routes.constants';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Server,
  },
  {
    path: APP_ROUTES.characters.slice(1),
    renderMode: RenderMode.Server,
  },
  {
    path: `${APP_ROUTES.characters.slice(1)}/:id`,
    renderMode: RenderMode.Server,
  },
  {
    path: APP_ROUTES.favorites.slice(1),
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
