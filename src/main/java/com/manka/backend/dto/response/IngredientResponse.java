package com.manka.backend.dto.response;

public record IngredientResponse(
        Long id,
        String name,
        Long parentIngredientId,
        String parentIngredientName
) {
}
