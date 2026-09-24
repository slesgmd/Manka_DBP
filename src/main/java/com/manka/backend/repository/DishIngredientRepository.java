package com.manka.backend.repository;

import com.manka.backend.model.DishIngredient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishIngredientRepository extends JpaRepository<DishIngredient, Long> {

    @Override
    @EntityGraph(attributePaths = {"dish", "ingredient"})
    List<DishIngredient> findAll();

    boolean existsByDishIdAndIngredientId(Long dishId, Long ingredientId);

    boolean existsByDishIdAndIngredientIdAndIdNot(Long dishId, Long ingredientId, Long id);
}
