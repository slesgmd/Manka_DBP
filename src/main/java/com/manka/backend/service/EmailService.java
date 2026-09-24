package com.manka.backend.service;

import java.time.Instant;

public interface EmailService {

    void sendWelcomeEmail(String name, String email);

    void sendCookingConfirmation(String name, String email, String dishName, Instant cookedAt);
}
