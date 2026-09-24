package com.manka.backend.dto.response;

import java.time.Instant;

public record PantryItemResponse(
        Long id,
        Long ingredientId,
        String ingredientName,
        Instant addedAt
) {
}
