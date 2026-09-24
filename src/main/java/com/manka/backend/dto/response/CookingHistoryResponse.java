package com.manka.backend.dto.response;

import java.time.Instant;

public record CookingHistoryResponse(
        Long id,
        Long dishId,
        String dishName,
        Instant cookedAt
) {
}
