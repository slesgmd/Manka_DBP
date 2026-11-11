export interface PantryItem {
  id: number;
  ingredientId: number;
  ingredientName: string;
  addedAt: string;
}

export interface PantryItemRequest {
  ingredientId: number;
}

export interface Favorite {
  id: number;
  dishId: number;
  dishName: string;
  totalTimeMinutes: number;
  createdAt: string;
}

export interface FavoriteRequest {
  dishId: number;
}

export interface CookingHistory {
  id: number;
  dishId: number;
  dishName: string;
  cookedAt: string;
}

export interface CookingHistoryRequest {
  dishId: number;
  cookedAt?: string;
}

export interface RecommendationBreakdown {
  scorer: string;
  score: number;
  weight: number;
  explanation: string;
}

export interface Recommendation {
  dishId: number;
  name: string;
  prepTimeMinutes: number;
  score: number;
  coveragePercent: number;
  missingIngredients: string[];
  breakdown: RecommendationBreakdown[];
}

export interface RecommendationParams {
  availableMinutes: number;
  limit?: number;
}
