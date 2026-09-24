package com.manka.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record DishIngredientCreateRequest(
        @NotNull @Positive Long dishId,
        @NotNull @Positive Long ingredientId
) {
}
