package com.manka.backend.dto.response;

import java.util.List;

public record RecommendationResponse(
        Long dishId,
        String name,
        int prepTimeMinutes,
        double score,
        double coveragePercent,
        List<String> missingIngredients,
        List<RecommendationBreakdown> breakdown
) {
}
