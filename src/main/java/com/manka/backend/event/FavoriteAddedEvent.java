package com.manka.backend.event;

import org.springframework.context.ApplicationEvent;

public class FavoriteAddedEvent extends ApplicationEvent {
    private final Long userId;
    private final Long dishId;
    private final String dishName;

    public FavoriteAddedEvent(Long userId, Long dishId, String dishName) {
        super(userId);
        this.userId = userId;
        this.dishId = dishId;
        this.dishName = dishName;
    }

    public Long userId() { return userId; }
    public Long dishId() { return dishId; }
    public String dishName() { return dishName; }
}
