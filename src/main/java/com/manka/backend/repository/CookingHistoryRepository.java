package com.manka.backend.repository;

import com.manka.backend.model.CookingHistory;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CookingHistoryRepository extends JpaRepository<CookingHistory, Long> {

    @EntityGraph(attributePaths = {"dish", "dish.proteinCategory"})
    List<CookingHistory> findAllByUserIdOrderByCookedAtDesc(Long userId);

    @Query("select h.dish.id, count(h) from CookingHistory h group by h.dish.id")
    List<Object[]> countByDish();

    Optional<CookingHistory> findByIdAndUserId(Long id, Long userId);

    boolean existsByDishId(Long dishId);
}
