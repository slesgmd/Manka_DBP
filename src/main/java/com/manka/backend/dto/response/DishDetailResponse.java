package com.manka.backend.dto.response;

import java.util.List;

public record DishDetailResponse(
        Long id,
        String name,
        Integer totalTimeMinutes,
        Long proteinCategoryId,
        String proteinCategoryName,
        List<IngredientSummaryResponse> ingredients
) {
}
