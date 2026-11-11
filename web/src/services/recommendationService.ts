import api from "./api";
import type { Recommendation, RecommendationParams } from "../types/account";

export const getRecommendations = (params: RecommendationParams, signal?: AbortSignal) =>
  api.get<Recommendation[]>("/recommendations", { params, signal }).then(r => r.data);
