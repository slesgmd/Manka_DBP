import type { PageParams } from "./common";

export interface IngredientSummary {
  id: number;
  name: string;
}

export interface Dish {
  id: number;
  name: string;
  totalTimeMinutes: number;
  proteinCategoryId: number;
  proteinCategoryName: string;
}

export interface DishDetail extends Dish {
  ingredients: IngredientSummary[];
}

export interface DishSearchParams extends PageParams {
  name?: string;
  maxPrepMinutes?: number;
  proteinCategoryId?: number;
}

export interface Ingredient {
  id: number;
  name: string;
  parentIngredientId: number | null;
  parentIngredientName: string | null;
}

export interface IngredientSearchParams extends PageParams {
  name?: string;
}
