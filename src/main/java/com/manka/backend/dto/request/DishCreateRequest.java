package com.manka.backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record DishCreateRequest(
        @NotBlank @Size(max = 160) String name,
        @NotNull @Min(1) Integer totalTimeMinutes,
        @NotNull @Positive Long proteinCategoryId
) {
}
