package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;

public interface RecommendationScorer {
    String name();

    ScoreResult score(Dish dish, RecommendationContext context);
}
