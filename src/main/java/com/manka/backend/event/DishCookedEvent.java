package com.manka.backend.event;

import org.springframework.context.ApplicationEvent;
import java.time.Instant;

public class DishCookedEvent extends ApplicationEvent {
    private final Long userId;
    private final String userName;
    private final String email;
    private final String dishName;
    private final Instant cookedAt;

    public DishCookedEvent(Long userId, String userName, String email, String dishName, Instant cookedAt) {
        super(userId);
        this.userId = userId;
        this.userName = userName;
        this.email = email;
        this.dishName = dishName;
        this.cookedAt = cookedAt;
    }

    public Long userId() { return userId; }
    public String userName() { return userName; }
    public String email() { return email; }
    public String dishName() { return dishName; }
    public Instant cookedAt() { return cookedAt; }
}
