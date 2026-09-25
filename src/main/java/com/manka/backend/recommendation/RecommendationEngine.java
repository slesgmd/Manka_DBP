package com.manka.backend.recommendation;

import com.manka.backend.dto.response.RecommendationBreakdown;
import com.manka.backend.dto.response.RecommendationResponse;
import com.manka.backend.model.Dish;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class RecommendationEngine {
    private final CoverageScorer coverageScorer;
    private final List<RecommendationScorer> scorers;
    private final RecommendationWeights weights;

    public RecommendationEngine(
            CoverageScorer coverageScorer,
            TimeScorer timeScorer,
            VarietyScorer varietyScorer,
            RepetitionScorer repetitionScorer,
            PopularityScorer popularityScorer,
            RecommendationWeights weights
    ) {
        this.coverageScorer = coverageScorer;
        this.scorers = List.of(coverageScorer, timeScorer, varietyScorer, repetitionScorer, popularityScorer);
        this.weights = weights;
    }

    public List<RecommendationResponse> rank(List<Dish> dishes, RecommendationContext context, int limit) {
        return dishes.stream()
                .filter(dish -> coverageScorer.score(dish, context).value() > 0)
                .map(dish -> evaluate(dish, context))
                .sorted(Comparator.comparingDouble(RecommendationResponse::score).reversed()
                        .thenComparing(RecommendationResponse::dishId))
                .limit(limit)
                .toList();
    }

    private RecommendationResponse evaluate(Dish dish, RecommendationContext context) {
        List<RecommendationBreakdown> breakdown = scorers.stream()
                .map(scorer -> detail(scorer, dish, context))
                .toList();
        double total = breakdown.stream().mapToDouble(item -> item.score() * item.weight()).sum();
        return new RecommendationResponse(
                dish.getId(), dish.getName(), dish.getTotalTimeMinutes(), round(total),
                breakdown.getFirst().score(),
                coverageScorer.missingIngredients(dish, context.pantryIngredients()), breakdown
        );
    }

    private RecommendationBreakdown detail(RecommendationScorer scorer, Dish dish, RecommendationContext context) {
        ScoreResult result = scorer.score(dish, context);
        double value = Math.max(0, Math.min(1, result.value()));
        return new RecommendationBreakdown(scorer.name(), round(value * 100),
                weights.forScorer(scorer.name()), result.explanation());
    }

    private double round(double value) {
        return Math.round(value * 10) / 10.0;
    }
}
