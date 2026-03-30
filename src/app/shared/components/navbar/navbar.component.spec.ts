import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { NavbarComponent } from './navbar.component';
import { favoritesReducer } from '../../../store/favorites/favorites.reducer';
import { APP_ROUTES } from '../../../core/constants/app-routes.constants';

describe('Navbar', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideRouter([
          { path: 'characters', component: NavbarComponent },
          { path: 'favorites', component: NavbarComponent },
        ]),
        provideStore({ favorites: favoritesReducer }),
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should keep Characters active when the page query param changes', async () => {
    await router.navigateByUrl(`${APP_ROUTES.characters}?page=2`);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const charactersLink = Array.from(compiled.querySelectorAll('.navbar__link')).find((link) =>
      link.textContent?.includes('CHARACTERS'),
    );

    expect(charactersLink?.classList.contains('navbar__link--active')).toBe(true);
  });
});
