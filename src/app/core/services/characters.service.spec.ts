import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';

import { createCharacter } from '../../../testing/character.fixture';
import { CharactersService } from './characters.service';

describe('CharactersService', () => {
  let service: CharactersService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CharactersService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should request a paginated character list', async () => {
    const response = {
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [createCharacter()],
    };

    const requestPromise = firstValueFrom(service.getCharacters(3));
    const request = httpTesting.expectOne(
      (req) =>
        req.method === 'GET' && req.url === '/api/character' && req.params.get('page') === '3',
    );

    request.flush(response);

    await expect(requestPromise).resolves.toEqual(response);
  });

  it('should request a character by id', async () => {
    const character = createCharacter({ id: 7, name: 'Abradolf Lincler' });

    const requestPromise = firstValueFrom(service.getCharacterById(7));
    const request = httpTesting.expectOne(
      (req) => req.method === 'GET' && req.url === '/api/character/7',
    );

    request.flush(character);

    await expect(requestPromise).resolves.toEqual(character);
  });
});
