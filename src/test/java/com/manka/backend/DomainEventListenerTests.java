package com.manka.backend;

import com.manka.backend.event.DishCookedEvent;
import com.manka.backend.event.DomainEventListener;
import com.manka.backend.event.FavoriteAddedEvent;
import com.manka.backend.event.UserRegisteredEvent;
import com.manka.backend.service.ActivityLogService;
import com.manka.backend.service.EmailService;
import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class DomainEventListenerTests {

    private final EmailService emailService = mock(EmailService.class);
    private final ActivityLogService activityLogService = mock(ActivityLogService.class);
    private final DomainEventListener listener = new DomainEventListener(emailService, activityLogService);

    @Test
    void routesRegistrationEventToWelcomeEmail() {
        UserRegisteredEvent event = new UserRegisteredEvent(1L, "Manka User", "user@manka.test");

        listener.onUserRegistered(event);

        verify(emailService).sendWelcomeEmail("Manka User", "user@manka.test");
    }

    @Test
    void routesCookingEventToConfirmationEmail() {
        Instant cookedAt = Instant.parse("2026-09-15T15:00:00Z");
        DishCookedEvent event = new DishCookedEvent(
                1L, "Manka User", "user@manka.test", "Lomo saltado", cookedAt
        );

        listener.onDishCooked(event);

        verify(emailService).sendCookingConfirmation(
                "Manka User", "user@manka.test", "Lomo saltado", cookedAt
        );
    }

    @Test
    void routesFavoriteEventToAsynchronousActivityService() {
        FavoriteAddedEvent event = new FavoriteAddedEvent(1L, 2L, "Ají de gallina");

        listener.onFavoriteAdded(event);

        verify(activityLogService).logFavoriteAdded(event);
    }
}
