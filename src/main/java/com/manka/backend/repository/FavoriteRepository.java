package com.manka.backend.repository;

import com.manka.backend.model.Favorite;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {

    @EntityGraph(attributePaths = "dish")
    List<Favorite> findAllByUserIdOrderByCreatedAtDesc(Long userId);

    Optional<Favorite> findByUserIdAndDishId(Long userId, Long dishId);

    boolean existsByUserIdAndDishId(Long userId, Long dishId);

    @Query("select f.dish.id, count(f) from Favorite f group by f.dish.id")
    List<Object[]> countByDish();
}
