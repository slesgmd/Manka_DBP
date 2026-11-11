import api from "./api";
import type { Page } from "../types/common";
import type { Ingredient, IngredientRequest, IngredientSearchParams } from "../types/catalog";

export const getIngredients = (params: IngredientSearchParams = {}, signal?: AbortSignal) =>
  api.get<Page<Ingredient>>("/ingredients", { params, signal }).then(r => r.data);

export const getIngredient = (id: number, signal?: AbortSignal) =>
  api.get<Ingredient>(`/ingredients/${id}`, { signal }).then(r => r.data);

export const createIngredient = (data: IngredientRequest) =>
  api.post<Ingredient>("/ingredients", data).then(r => r.data);

export const updateIngredient = (id: number, data: IngredientRequest) =>
  api.put<Ingredient>(`/ingredients/${id}`, data).then(r => r.data);

export const deleteIngredient = (id: number) => api.delete(`/ingredients/${id}`);
