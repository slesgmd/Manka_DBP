import api from "./api";
import type { PantryItem, PantryItemRequest } from "../types/account";

export const getPantryItems = (signal?: AbortSignal) =>
  api.get<PantryItem[]>("/pantry-items", { signal }).then(r => r.data);

export const addPantryItem = (data: PantryItemRequest) =>
  api.post<PantryItem>("/pantry-items", data).then(r => r.data);

export const removePantryItem = (ingredientId: number) => api.delete(`/pantry-items/${ingredientId}`);
