import { Character } from '../app/shared/models/character.model';

const baseCharacter: Character = {
  id: 1,
  name: 'Rick Sanchez',
  status: 'Alive',
  species: 'Human',
  type: '',
  gender: 'Male',
  origin: {
    name: 'Earth (C-137)',
    url: 'https://rickandmortyapi.com/api/location/1',
  },
  location: {
    name: 'Citadel of Ricks',
    url: 'https://rickandmortyapi.com/api/location/3',
  },
  image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
  episode: ['https://rickandmortyapi.com/api/episode/1'],
  url: 'https://rickandmortyapi.com/api/character/1',
  created: '2017-11-04T18:48:46.250Z',
};

export function createCharacter(overrides: Partial<Character> = {}): Character {
  return {
    ...baseCharacter,
    ...overrides,
    origin: {
      ...baseCharacter.origin,
      ...overrides.origin,
    },
    location: {
      ...baseCharacter.location,
      ...overrides.location,
    },
    episode: overrides.episode ?? baseCharacter.episode,
  };
}
