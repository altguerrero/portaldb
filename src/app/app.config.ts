import { ApplicationConfig, isDevMode, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { provideStore } from '@ngrx/store';
import { favoritesReducer } from './store/favorites/favorites.reducer';
import { FavoritesEffects } from './store/favorites/favorites.effects';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
      }),
    ),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch()),
    provideStore({ favorites: favoritesReducer }),
    provideEffects([FavoritesEffects]),
    ...(isDevMode() ? [provideStoreDevtools({ maxAge: 25, logOnly: false })] : []),
  ],
};
