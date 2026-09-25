package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class RepetitionScorer implements RecommendationScorer {
    @Override
    public String name() {
        return "repetition";
    }

    @Override
    public ScoreResult score(Dish dish, RecommendationContext context) {
        Instant lastCooked = context.history().stream()
                .filter(item -> item.getDish().getId().equals(dish.getId()))
                .map(item -> item.getCookedAt())
                .max(Instant::compareTo)
                .orElse(null);
        if (lastCooked == null) {
            return new ScoreResult(1, "Aún no has cocinado este plato");
        }
        long seconds = Math.max(0, Duration.between(lastCooked, context.now()).getSeconds());
        double value = Math.min(1, seconds / 604800.0);
        return new ScoreResult(value, "No lo cocinas hace " + seconds / 86400 + " días");
    }
}
