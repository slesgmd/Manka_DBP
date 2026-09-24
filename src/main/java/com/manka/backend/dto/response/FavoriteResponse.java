package com.manka.backend.dto.response;

import java.time.Instant;

public record FavoriteResponse(
        Long id,
        Long dishId,
        String dishName,
        Integer totalTimeMinutes,
        Instant createdAt
) {
}
