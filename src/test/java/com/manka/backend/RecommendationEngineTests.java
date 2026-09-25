package com.manka.backend;

import com.manka.backend.model.CookingHistory;
import com.manka.backend.model.Dish;
import com.manka.backend.model.DishIngredient;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.ProteinCategory;
import com.manka.backend.model.User;
import com.manka.backend.recommendation.CoverageScorer;
import com.manka.backend.recommendation.PopularityScorer;
import com.manka.backend.recommendation.RecommendationContext;
import com.manka.backend.recommendation.RecommendationEngine;
import com.manka.backend.recommendation.RecommendationWeights;
import com.manka.backend.recommendation.RepetitionScorer;
import com.manka.backend.recommendation.TimeScorer;
import com.manka.backend.recommendation.VarietyScorer;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class RecommendationEngineTests {
    private final Instant now = Instant.parse("2026-09-24T12:00:00Z");
    private final CoverageScorer coverage = new CoverageScorer();

    @Test
    void coversParentAndVariantInBothDirections() {
        Ingredient parent = ingredient(1, "pollo");
        Ingredient variant = ingredient(2, "pechuga de pollo");
        variant.setParentIngredient(parent);
        Dish variantDish = dish(1, 20, variant);
        Dish parentDish = dish(2, 20, parent);

        assertEquals(1, coverage.score(variantDish, context(List.of(parent), List.of())).value());
        assertEquals(1, coverage.score(parentDish, context(List.of(variant), List.of())).value());
        assertTrue(coverage.missingIngredients(variantDish, List.of(parent)).isEmpty());
    }

    @Test
    void timeScoreFallsLinearlyToZeroAtDoubleAvailableTime() {
        TimeScorer scorer = new TimeScorer();
        Ingredient rice = ingredient(1, "arroz");
        assertEquals(1, scorer.score(dish(1, 30, rice), context(List.of(rice), List.of())).value());
        assertEquals(0.5, scorer.score(dish(2, 45, rice), context(List.of(rice), List.of())).value());
        assertEquals(0, scorer.score(dish(3, 60, rice), context(List.of(rice), List.of())).value());
    }

    @Test
    void varietyPenalizesRepeatedProteinInLastWeek() {
        Ingredient rice = ingredient(1, "arroz");
        Dish dish = dish(1, 20, rice);
        List<CookingHistory> history = List.of(cooked(dish, now.minus(1, ChronoUnit.DAYS)),
                cooked(dish, now.minus(2, ChronoUnit.DAYS)));
        assertEquals(1.0 / 3, new VarietyScorer().score(dish, context(List.of(rice), history)).value());
    }

    @Test
    void repetitionRecoversOverSevenDays() {
        Ingredient rice = ingredient(1, "arroz");
        Dish dish = dish(1, 20, rice);
        RepetitionScorer scorer = new RepetitionScorer();
        assertEquals(0, scorer.score(dish, context(List.of(rice), List.of(cooked(dish, now)))).value());
        assertEquals(0.5, scorer.score(dish, context(List.of(rice),
                List.of(cooked(dish, now.minus(84, ChronoUnit.HOURS))))).value());
        assertEquals(1, scorer.score(dish, context(List.of(rice),
                List.of(cooked(dish, now.minus(7, ChronoUnit.DAYS))))).value());
    }

    @Test
    void popularityNormalizesAgainstLargestCandidateCount() {
        Dish dish = dish(1, 20, ingredient(1, "arroz"));
        RecommendationContext context = new RecommendationContext(List.of(), 30, List.of(),
                Map.of(1L, 3L), 6, now);
        assertEquals(0.5, new PopularityScorer().score(dish, context).value());
    }

    @Test
    void engineOrdersCandidatesAndKeepsScoresInRange() {
        Ingredient rice = ingredient(1, "arroz");
        Dish fast = dish(1, 20, rice);
        Dish slow = dish(2, 60, rice);
        RecommendationEngine engine = new RecommendationEngine(coverage, new TimeScorer(),
                new VarietyScorer(), new RepetitionScorer(), new PopularityScorer(),
                new RecommendationWeights(0.35, 0.20, 0.10, 0.20, 0.15));
        var result = engine.rank(List.of(slow, fast), context(List.of(rice), List.of()), 10);
        assertEquals(1L, result.getFirst().dishId());
        assertEquals(2, result.size());
        assertTrue(result.stream().allMatch(item -> item.score() >= 0 && item.score() <= 100));
        assertEquals(5, result.getFirst().breakdown().size());
    }

    @Test
    void invalidWeightsAreRejected() {
        assertThrows(IllegalArgumentException.class,
                () -> new RecommendationWeights(0.35, 0.20, 0.10, 0.20, 0.10));
    }

    private Ingredient ingredient(long id, String name) {
        Ingredient ingredient = new Ingredient(name);
        ingredient.setId(id);
        return ingredient;
    }

    private Dish dish(long id, int minutes, Ingredient required) {
        ProteinCategory category = new ProteinCategory("Pollo");
        category.setId(1L);
        Dish dish = new Dish("Plato " + id, minutes, category);
        dish.setId(id);
        dish.getDishIngredients().add(new DishIngredient(dish, required));
        return dish;
    }

    private CookingHistory cooked(Dish dish, Instant when) {
        return new CookingHistory(new User("Ana", "ana@example.com", "hash"), dish, when);
    }

    private RecommendationContext context(List<Ingredient> pantry, List<CookingHistory> history) {
        return new RecommendationContext(pantry, 30, history, Map.of(), 0, now);
    }
}
