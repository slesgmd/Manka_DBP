import api from "./api";
import type { Favorite, FavoriteRequest } from "../types/account";

export const getFavorites = (signal?: AbortSignal) =>
  api.get<Favorite[]>("/favorites", { signal }).then(r => r.data);

export const addFavorite = (data: FavoriteRequest) =>
  api.post<Favorite>("/favorites", data).then(r => r.data);

export const removeFavorite = (dishId: number) => api.delete(`/favorites/${dishId}`);
