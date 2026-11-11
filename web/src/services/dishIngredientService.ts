import api from "./api";
import type { DishIngredient, DishIngredientRequest } from "../types/catalog";

export const getDishIngredients = (signal?: AbortSignal) =>
  api.get<DishIngredient[]>("/dish-ingredients", { signal }).then(r => r.data);

export const getDishIngredient = (id: number, signal?: AbortSignal) =>
  api.get<DishIngredient>(`/dish-ingredients/${id}`, { signal }).then(r => r.data);

export const createDishIngredient = (data: DishIngredientRequest) =>
  api.post<DishIngredient>("/dish-ingredients", data).then(r => r.data);

export const updateDishIngredient = (id: number, data: DishIngredientRequest) =>
  api.put<DishIngredient>(`/dish-ingredients/${id}`, data).then(r => r.data);

export const deleteDishIngredient = (id: number) => api.delete(`/dish-ingredients/${id}`);
