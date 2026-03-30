import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { loadFavoritesFromStorage } from './store/favorites/favorites.actions';
import { APP_CONFIG } from './core/constants/app.constants';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  private readonly store = inject(Store);
  private readonly platformId = inject(PLATFORM_ID);

  readonly config = APP_CONFIG;
  protected readonly title = signal('portaldb');

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(loadFavoritesFromStorage());
    }
  }
}
