import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly config = APP_CONFIG;
  protected readonly title = signal('portaldb');
  readonly isRouteTransitioning = signal(false);
  private routeTransitionTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.store.dispatch(loadFavoritesFromStorage());
      this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.clearRouteTransitionTimeout();
          this.isRouteTransitioning.set(this.shouldAnimateRoute(event.url));
        }

        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.finishRouteTransition();
        }
      });

      this.destroyRef.onDestroy(() => {
        this.clearRouteTransitionTimeout();
      });
    }
  }

  handleRouteActivate(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.finishRouteTransition();
    }
  }

  private finishRouteTransition(): void {
    this.clearRouteTransitionTimeout();
    this.routeTransitionTimeout = setTimeout(() => {
      this.isRouteTransitioning.set(false);
      this.routeTransitionTimeout = null;
    }, 220);
  }

  private clearRouteTransitionTimeout(): void {
    if (this.routeTransitionTimeout) {
      clearTimeout(this.routeTransitionTimeout);
      this.routeTransitionTimeout = null;
    }
  }

  private shouldAnimateRoute(url: string): boolean {
    return !/^\/characters\/[^/?#]+(?:[?#].*)?$/.test(url);
  }
}
