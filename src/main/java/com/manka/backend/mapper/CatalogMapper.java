package com.manka.backend.mapper;

import com.manka.backend.dto.response.DishDetailResponse;
import com.manka.backend.dto.response.DishIngredientResponse;
import com.manka.backend.dto.response.DishResponse;
import com.manka.backend.dto.response.IngredientResponse;
import com.manka.backend.dto.response.IngredientSummaryResponse;
import com.manka.backend.dto.response.ProteinCategoryResponse;
import com.manka.backend.model.Dish;
import com.manka.backend.model.DishIngredient;
import com.manka.backend.model.Ingredient;
import com.manka.backend.model.ProteinCategory;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CatalogMapper {

    public ProteinCategoryResponse toResponse(ProteinCategory category) {
        return new ProteinCategoryResponse(category.getId(), category.getName());
    }

    public IngredientResponse toResponse(Ingredient ingredient) {
        Ingredient parent = ingredient.getParentIngredient();
        return new IngredientResponse(
                ingredient.getId(),
                ingredient.getName(),
                parent == null ? null : parent.getId(),
                parent == null ? null : parent.getName()
        );
    }

    public DishResponse toResponse(Dish dish) {
        return new DishResponse(
                dish.getId(),
                dish.getName(),
                dish.getTotalTimeMinutes(),
                dish.getProteinCategory().getId(),
                dish.getProteinCategory().getName()
        );
    }

    public DishDetailResponse toDetailResponse(Dish dish) {
        List<IngredientSummaryResponse> ingredients = dish.getDishIngredients().stream()
                .map(DishIngredient::getIngredient)
                .map(ingredient -> new IngredientSummaryResponse(ingredient.getId(), ingredient.getName()))
                .toList();
        return new DishDetailResponse(
                dish.getId(),
                dish.getName(),
                dish.getTotalTimeMinutes(),
                dish.getProteinCategory().getId(),
                dish.getProteinCategory().getName(),
                ingredients
        );
    }

    public DishIngredientResponse toResponse(DishIngredient dishIngredient) {
        return new DishIngredientResponse(
                dishIngredient.getId(),
                dishIngredient.getDish().getId(),
                dishIngredient.getDish().getName(),
                dishIngredient.getIngredient().getId(),
                dishIngredient.getIngredient().getName()
        );
    }
}
