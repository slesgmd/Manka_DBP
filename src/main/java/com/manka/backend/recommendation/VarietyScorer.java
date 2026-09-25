package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;
import org.springframework.stereotype.Component;

import java.time.temporal.ChronoUnit;

@Component
public class VarietyScorer implements RecommendationScorer {
    @Override
    public String name() {
        return "variety";
    }

    @Override
    public ScoreResult score(Dish dish, RecommendationContext context) {
        long count = context.history().stream()
                .filter(item -> item.getCookedAt().isAfter(context.now().minus(7, ChronoUnit.DAYS)))
                .filter(item -> item.getDish().getProteinCategory().getId()
                        .equals(dish.getProteinCategory().getId()))
                .count();
        double value = 1.0 / (1 + count);
        return new ScoreResult(value, count == 0
                ? "No has cocinado esta proteína en 7 días"
                : "Cocinaste esta proteína " + count + " veces en 7 días");
    }
}
