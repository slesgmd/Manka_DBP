export const ROUTES = {
  login: "/login",
  register: "/registro",
  home: "/",
  catalog: "/catalogo",
  dish: "/platos/:id",
  pantry: "/despensa",
  favorites: "/favoritos",
  history: "/historial",
  profile: "/perfil",
  admin: "/admin",
};

export const dishPath = (id: number | string) => `/platos/${id}`;

export const ROUTE_LABELS: Record<string, string> = {
  catalogo: "Catálogo de platos",
  platos: "Catálogo de platos",
  despensa: "Despensa",
  favoritos: "Favoritos",
  historial: "Historial",
  perfil: "Perfil",
  admin: "Administración",
};
