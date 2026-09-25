package com.manka.backend.event;

import org.springframework.context.ApplicationEvent;

public class UserRegisteredEvent extends ApplicationEvent {
    private final Long userId;
    private final String name;
    private final String email;

    public UserRegisteredEvent(Long userId, String name, String email) {
        super(userId);
        this.userId = userId;
        this.name = name;
        this.email = email;
    }

    public Long userId() { return userId; }
    public String name() { return name; }
    public String email() { return email; }
}
