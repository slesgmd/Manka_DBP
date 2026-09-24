package com.manka.backend.event;

public record FavoriteAddedEvent(Long userId, Long dishId, String dishName) {
}
