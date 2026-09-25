package com.manka.backend.repository;

import com.manka.backend.model.Dish;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DishRepository extends JpaRepository<Dish, Long> {

    @Override
    @EntityGraph(attributePaths = "proteinCategory")
    List<Dish> findAll();

    @EntityGraph(attributePaths = {"proteinCategory", "dishIngredients.ingredient"})
    Optional<Dish> findDetailById(Long id);

    @Query("select distinct d from Dish d join fetch d.dishIngredients di join fetch di.ingredient i "
            + "left join fetch i.parentIngredient left join fetch d.proteinCategory")
    List<Dish> findAllForRecommendations();

    @EntityGraph(attributePaths = "proteinCategory")
    @Query("select d from Dish d where (:name is null or lower(d.name) like lower(concat('%', :name, '%'))) "
            + "and (:maxMinutes is null or d.totalTimeMinutes <= :maxMinutes) "
            + "and (:categoryId is null or d.proteinCategory.id = :categoryId)")
    Page<Dish> search(@Param("name") String name, @Param("maxMinutes") Integer maxMinutes,
                      @Param("categoryId") Long categoryId, Pageable pageable);

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
