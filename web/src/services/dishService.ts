import api from "./api";
import type { Page } from "../types/common";
import type { Dish, DishDetail, DishRequest, DishSearchParams } from "../types/catalog";

export const getDishes = (params: DishSearchParams = {}, signal?: AbortSignal) =>
  api.get<Page<Dish>>("/dishes", { params, signal }).then(r => r.data);

export const getDish = (id: number, signal?: AbortSignal) =>
  api.get<DishDetail>(`/dishes/${id}`, { signal }).then(r => r.data);

export const createDish = (data: DishRequest) =>
  api.post<DishDetail>("/dishes", data).then(r => r.data);

export const updateDish = (id: number, data: DishRequest) =>
  api.put<DishDetail>(`/dishes/${id}`, data).then(r => r.data);

export const deleteDish = (id: number) => api.delete(`/dishes/${id}`);
