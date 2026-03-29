import { RenderMode, ServerRoute } from '@angular/ssr';
import { APP_ROUTES } from './core/constants/app-routes.constants';

export const serverRoutes: ServerRoute[] = [
  {
    path: `${APP_ROUTES.characters.slice(1)}/:id`,
    renderMode: RenderMode.Server,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
