package com.manka.backend.service;

import com.manka.backend.event.FavoriteAddedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class ActivityLogService {

    private static final Logger LOGGER = LoggerFactory.getLogger(ActivityLogService.class);

    @Async("applicationTaskExecutor")
    public void logFavoriteAdded(FavoriteAddedEvent event) {
        LOGGER.info(
                "Favorite added: userId={}, dishId={}, dishName={}",
                event.userId(),
                event.dishId(),
                event.dishName()
        );
    }
}
