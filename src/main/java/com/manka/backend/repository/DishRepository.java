package com.manka.backend.repository;

import com.manka.backend.model.Dish;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, Long> {

    @Override
    @EntityGraph(attributePaths = "proteinCategory")
    List<Dish> findAll();

    @EntityGraph(attributePaths = {"proteinCategory", "dishIngredients.ingredient"})
    Optional<Dish> findDetailById(Long id);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
