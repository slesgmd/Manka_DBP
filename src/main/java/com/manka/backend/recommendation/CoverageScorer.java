package com.manka.backend.recommendation;

import com.manka.backend.model.Dish;
import com.manka.backend.model.Ingredient;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CoverageScorer implements RecommendationScorer {
    @Override
    public String name() {
        return "coverage";
    }

    @Override
    public ScoreResult score(Dish dish, RecommendationContext context) {
        int total = dish.getDishIngredients().size();
        if (total == 0) {
            return new ScoreResult(0, "El plato no tiene ingredientes registrados");
        }
        int covered = total - missingIngredients(dish, context.pantryIngredients()).size();
        double value = covered / (double) total;
        return new ScoreResult(value, "Tienes el " + Math.round(value * 100) + "% de los ingredientes");
    }

    public List<String> missingIngredients(Dish dish, List<Ingredient> pantry) {
        return dish.getDishIngredients().stream()
                .map(item -> item.getIngredient())
                .filter(required -> pantry.stream().noneMatch(available -> matches(required, available)))
                .map(Ingredient::getName)
                .toList();
    }

    boolean matches(Ingredient required, Ingredient available) {
        if (required.getId().equals(available.getId())) {
            return true;
        }
        Ingredient requiredParent = required.getParentIngredient();
        Ingredient availableParent = available.getParentIngredient();
        return requiredParent != null && requiredParent.getId().equals(available.getId())
                || availableParent != null && availableParent.getId().equals(required.getId());
    }
}
