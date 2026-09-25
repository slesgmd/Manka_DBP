package com.manka.backend.repository;

import com.manka.backend.model.Ingredient;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IngredientRepository extends JpaRepository<Ingredient, Long> {

    @Override
    @EntityGraph(attributePaths = "parentIngredient")
    List<Ingredient> findAll();

    @EntityGraph(attributePaths = "parentIngredient")
    @Query("select i from Ingredient i where :name is null or lower(i.name) like lower(concat('%', :name, '%'))")
    Page<Ingredient> search(@Param("name") String name, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
