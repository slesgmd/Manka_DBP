package com.manka.backend.dto.response;

public record DishIngredientResponse(
        Long id,
        Long dishId,
        String dishName,
        Long ingredientId,
        String ingredientName
) {
}
