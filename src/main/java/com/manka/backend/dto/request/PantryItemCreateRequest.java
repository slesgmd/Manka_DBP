package com.manka.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PantryItemCreateRequest(@NotNull @Positive Long ingredientId) {
}
