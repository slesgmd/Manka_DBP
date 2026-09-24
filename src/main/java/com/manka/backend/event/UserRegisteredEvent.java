package com.manka.backend.event;

public record UserRegisteredEvent(Long userId, String name, String email) {
}
