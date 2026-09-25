package com.manka.backend.recommendation;

import com.manka.backend.model.CookingHistory;
import com.manka.backend.model.Ingredient;

import java.time.Instant;
import java.util.List;
import java.util.Map;

public record RecommendationContext(
        List<Ingredient> pantryIngredients,
        int availableMinutes,
        List<CookingHistory> history,
        Map<Long, Long> popularity,
        long maxPopularity,
        Instant now
) {
}
