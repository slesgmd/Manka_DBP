package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;
import org.springframework.stereotype.Component;

@Component
public class PopularityScorer implements RecommendationScorer {
    @Override
    public String name() {
        return "popularity";
    }

    @Override
    public ScoreResult score(Dish dish, RecommendationContext context) {
        long count = context.popularity().getOrDefault(dish.getId(), 0L);
        double value = context.maxPopularity() == 0 ? 0 : count / (double) context.maxPopularity();
        return new ScoreResult(value, "Aparece " + count + " veces en historiales y favoritos");
    }
}
