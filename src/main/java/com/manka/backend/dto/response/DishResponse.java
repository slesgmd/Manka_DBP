package com.manka.backend.dto.response;

public record DishResponse(
        Long id,
        String name,
        Integer totalTimeMinutes,
        Long proteinCategoryId,
        String proteinCategoryName
) {
}
