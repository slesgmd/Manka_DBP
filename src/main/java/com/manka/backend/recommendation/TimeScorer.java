package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;
import org.springframework.stereotype.Component;

@Component
public class TimeScorer implements RecommendationScorer {
    @Override
    public String name() {
        return "time";
    }

    @Override
    public ScoreResult score(Dish dish, RecommendationContext context) {
        int minutes = dish.getTotalTimeMinutes();
        double value = minutes <= context.availableMinutes() ? 1
                : Math.max(0, 2 - minutes / (double) context.availableMinutes());
        String explanation = minutes <= context.availableMinutes()
                ? "Listo en " + minutes + " min"
                : "Requiere " + minutes + " min y tienes " + context.availableMinutes() + " min";
        return new ScoreResult(value, explanation);
    }
}
