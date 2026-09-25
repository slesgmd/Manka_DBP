package com.manka.backend.repository;

import com.manka.backend.model.PantryItem;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PantryItemRepository extends JpaRepository<PantryItem, Long> {

    @EntityGraph(attributePaths = {"ingredient", "ingredient.parentIngredient"})
    List<PantryItem> findAllByUserIdOrderByAddedAtDesc(Long userId);

    Optional<PantryItem> findByUserIdAndIngredientId(Long userId, Long ingredientId);

    boolean existsByUserIdAndIngredientId(Long userId, Long ingredientId);

    boolean existsByIngredientId(Long ingredientId);
}
