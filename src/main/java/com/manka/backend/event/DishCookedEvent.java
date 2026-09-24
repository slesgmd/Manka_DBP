package com.manka.backend.event;

import java.time.Instant;

public record DishCookedEvent(
        Long userId,
        String userName,
        String email,
        String dishName,
        Instant cookedAt
) {
}
