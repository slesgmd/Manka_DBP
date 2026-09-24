package com.manka.backend.event;

import com.manka.backend.service.ActivityLogService;
import com.manka.backend.service.EmailService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Component
public class DomainEventListener {

    private final EmailService emailService;
    private final ActivityLogService activityLogService;

    public DomainEventListener(EmailService emailService, ActivityLogService activityLogService) {
        this.emailService = emailService;
        this.activityLogService = activityLogService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onUserRegistered(UserRegisteredEvent event) {
        emailService.sendWelcomeEmail(event.name(), event.email());
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onDishCooked(DishCookedEvent event) {
        emailService.sendCookingConfirmation(
                event.userName(),
                event.email(),
                event.dishName(),
                event.cookedAt()
        );
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onFavoriteAdded(FavoriteAddedEvent event) {
        activityLogService.logFavoriteAdded(event);
    }
}
