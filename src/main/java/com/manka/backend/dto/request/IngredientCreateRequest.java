package com.manka.backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record IngredientCreateRequest(
        @NotBlank @Size(max = 120) String name,
        @Positive Long parentIngredientId
) {
}
