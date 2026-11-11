import api from "./api";
import type { CookingHistory, CookingHistoryRequest } from "../types/account";

export const getHistory = (signal?: AbortSignal) =>
  api.get<CookingHistory[]>("/cooking-history", { signal }).then(r => r.data);

export const addHistory = (data: CookingHistoryRequest) =>
  api.post<CookingHistory>("/cooking-history", data).then(r => r.data);

export const deleteHistory = (id: number) => api.delete(`/cooking-history/${id}`);
