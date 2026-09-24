package com.manka.backend.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.Instant;

public record CookingHistoryCreateRequest(
        @NotNull @Positive Long dishId,
        Instant cookedAt
) {
}
