export const API_ROUTES = {
  characters: {
    base: '/character',
    byId: (id: number) => `/character/${id}`,
  },
} as const;
