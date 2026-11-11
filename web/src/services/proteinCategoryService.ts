import api from "./api";
import type { ProteinCategory, ProteinCategoryRequest } from "../types/catalog";

export const getProteinCategories = (signal?: AbortSignal) =>
  api.get<ProteinCategory[]>("/protein-categories", { signal }).then(r => r.data);

export const getProteinCategory = (id: number, signal?: AbortSignal) =>
  api.get<ProteinCategory>(`/protein-categories/${id}`, { signal }).then(r => r.data);

export const createProteinCategory = (data: ProteinCategoryRequest) =>
  api.post<ProteinCategory>("/protein-categories", data).then(r => r.data);

export const updateProteinCategory = (id: number, data: ProteinCategoryRequest) =>
  api.put<ProteinCategory>(`/protein-categories/${id}`, data).then(r => r.data);

export const deleteProteinCategory = (id: number) => api.delete(`/protein-categories/${id}`);
