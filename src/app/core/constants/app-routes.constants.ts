export const APP_ROUTES = {
  characters: '/characters',
  characterDetail: (id: number | string) => `/characters/${id}`,
  favorites: '/favorites',
} as const;
