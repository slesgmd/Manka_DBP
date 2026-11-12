import api from "./api";
import type { Page } from "../types/common";
import type { Ingredient, IngredientSearchParams } from "../types/catalog";

export const getIngredients = (params: IngredientSearchParams = {}, signal?: AbortSignal) =>
  api.get<Page<Ingredient>>("/ingredients", { params, signal }).then(r => r.data);
